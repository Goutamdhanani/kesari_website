import express from 'express';
import {randomBytes,timingSafeEqual} from 'node:crypto';

export function createApp(store,adminPassword) {
  const app=express(),sessions=new Map(),attempts=new Map();
  app.disable('x-powered-by');
  app.use(express.json({limit:'10mb'}));
  app.use((req,res,next)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    if(req.path.startsWith('/api/'))res.setHeader('Cache-Control','no-store');
    if(!['GET','HEAD','OPTIONS'].includes(req.method)){
      const origin=req.headers.origin;
      if(origin&&origin!==`${req.protocol}://${req.headers.host}`)return res.status(403).json({error:'Origin not allowed.'});
    }
    next();
  });

  const limited=(req,res,next)=>{
    const key=req.ip+req.path,now=Date.now();
    let x=attempts.get(key);
    if(!x||now-x.at>60000)x={at:now,n:0};
    x.n++;
    attempts.set(key,x);
    if(x.n>50)return res.status(429).json({error:'Too many requests. Try again in a minute.'});
    next();
  };

  const cookie=req=>(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('kesari_session='))?.slice(15);
  const auth=(req,res,next)=>sessions.get(cookie(req))>Date.now()?next():res.status(401).json({error:'Please sign in.'});
  const publicOrder=o=>{const {token,requestKey,...rest}=o;return rest;};
  const owned=(req,res,next)=>{const o=store.get('order',req.params.id);if(!o||req.headers.authorization!==`Bearer ${o.token}`)return res.status(404).json({error:'Booking not found.'});req.order=o;next();};

  // Public content & events
  app.get('/api/content',(req,res)=>res.json(store.publicContent()));

  // Public Menu
  app.get('/api/menu',(req,res)=>res.json(store.getMenu()));

  // Public Artists
  app.get('/api/artists',(req,res)=>{
    const approved=store.all('artist').filter(a=>a.status==='approved').map(store.publicArtist);
    res.json(approved);
  });
  app.post('/api/artists/register',limited,(req,res)=>{
    const created=store.createArtist(req.body);
    res.status(201).json(store.publicArtist(created));
  });

  // Public Hall Bookings
  app.post('/api/bookings',limited,(req,res)=>{
    const created=store.createBooking(req.body);
    res.status(201).json(created);
  });

  // Public Bulk Food Orders
  app.post('/api/bulk-food',limited,(req,res)=>{
    const created=store.createBulkFoodOrder(req.body);
    res.status(201).json(created);
  });

  // Admin Auth
  app.post('/api/admin/login',limited,(req,res)=>{
    const a=Buffer.from(String(req.body.password||'')),b=Buffer.from(adminPassword);
    if(a.length!==b.length||!timingSafeEqual(a,b))return res.status(401).json({error:'Incorrect password.'});
    const token=randomBytes(32).toString('hex');
    sessions.set(token,Date.now()+8*3600000);
    res.cookie('kesari_session',token,{httpOnly:true,sameSite:'strict',secure:req.secure,maxAge:8*3600000});
    res.json({ok:true});
  });
  app.post('/api/admin/logout',auth,(req,res)=>{
    sessions.delete(cookie(req));
    res.clearCookie('kesari_session');
    res.json({ok:true});
  });

  // Full Admin Overview
  app.get('/api/admin',auth,(req,res)=>res.json({
    events:store.all('event'),
    settings:store.get('settings','main'),
    orders:store.all('order').map(publicOrder),
    enquiries:store.all('enquiry'),
    menu:store.getMenu(),
    artists:store.all('artist'),
    bookings:store.all('booking'),
    bulkFood:store.all('bulk_food')
  }));

  // Admin Events & Settings
  app.put('/api/admin/events/:id',auth,(req,res)=>res.json(store.event(req.body,req.params.id)));
  app.put('/api/admin/settings',auth,(req,res)=>{
    const d=req.body;
    const upiId=store.text(d.upiId,100),payeeName=store.text(d.payeeName,100),email=store.text(d.email,150),phone=store.text(d.phone,18);
    if(!/^[\w.-]+@[\w.-]+$/.test(upiId)||!/^\S+@\S+\.\S+$/.test(email)||!/^[+0-9 ()-]{10,18}$/.test(phone))return res.status(400).json({error:'Check the UPI ID, email and phone.'});
    res.json(store.put('settings','main',{upiId,payeeName,email,phone}));
  });

  // Admin Menu CRUD
  app.get('/api/admin/menu',auth,(req,res)=>res.json(store.getMenu()));
  app.post('/api/admin/menu',auth,(req,res)=>res.status(201).json(store.createMenuItem(req.body)));
  app.put('/api/admin/menu/:id',auth,(req,res)=>res.json(store.updateMenuItem(req.params.id,req.body)));
  app.delete('/api/admin/menu/:id',auth,(req,res)=>res.json(store.deleteMenuItem(req.params.id)));

  // Admin Artists Review
  app.get('/api/admin/artists',auth,(req,res)=>res.json(store.all('artist')));
  app.post('/api/admin/artists/:id/review',auth,(req,res)=>res.json(store.reviewArtist(req.params.id,req.body.status)));

  // Admin Bookings
  app.get('/api/admin/bookings',auth,(req,res)=>res.json(store.all('booking')));
  app.post('/api/admin/bookings/:id/status',auth,(req,res)=>res.json(store.updateBookingStatus(req.params.id,req.body.status)));

  // Admin Bulk Food Orders
  app.get('/api/admin/bulk-food',auth,(req,res)=>res.json(store.all('bulk_food')));
  app.post('/api/admin/bulk-food/:id/status',auth,(req,res)=>res.json(store.updateBulkFoodStatus(req.params.id,req.body.status)));

  // Orders & UPI verification
  app.post('/api/orders',limited,(req,res)=>res.status(201).json(store.order(req.body)));
  app.get('/api/orders/:id',owned,(req,res)=>res.json(publicOrder(req.order)));
  app.post('/api/orders/:id/payment',limited,owned,(req,res)=>res.json(publicOrder(store.payment(req.params.id,store.text(req.body.utr,40)))));
  app.post('/api/admin/orders/:id/review',auth,(req,res)=>res.json(publicOrder(store.review(req.params.id,req.body.status))));

  app.use('/api',(req,res)=>res.status(404).json({error:'Not found.'}));
  app.use((err,req,res,next)=>{
    if(!req.path.startsWith('/api/'))return next(err);
    res.status(err.status||500).json({error:err.status?err.message:'Unable to complete the request.'});
  });

  const cleanup=setInterval(()=>{
    const now=Date.now();
    for(const[k,v]of attempts)if(now-v.at>60000)attempts.delete(k);
    for(const[k,v]of sessions)if(v<now)sessions.delete(k);
  },60000);
  cleanup.unref();

  return app;
}
