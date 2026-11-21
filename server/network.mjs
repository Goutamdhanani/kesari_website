import {networkInterfaces} from 'node:os';
import QRCode from 'qrcode';
import {writeFile} from 'node:fs/promises';

export function lanUrls(port) {
 const adapters = Object.entries(networkInterfaces()).flatMap(([name, addresses]) =>
  (addresses || []).map(address => ({name, address}))
 );
 const isLanAddress = ({address, name}) => address && address.family === 'IPv4' && !address.internal
  && !/(virtual|vEthernet|wsl|vmware|virtualbox|docker|hyper-v)/i.test(name)
  && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address.address);
 const priority = ({name}) => /(wi-?fi|wlan|wireless)/i.test(name) ? 2 : /(ethernet|local area connection)/i.test(name) ? 1 : 0;
 return [...new Set(adapters.filter(isLanAddress).sort((a, b) => priority(b) - priority(a))
  .map(({address}) => `http://${address.address}:${port}/#/`))];
}

export async function writeNetworkQr(url, root) {
 await QRCode.toFile(`${root}/public/network-qr.png`, url, {width:640,margin:4,errorCorrectionLevel:'M',color:{dark:'#152321ff',light:'#ffffffff'}});
 await writeFile(`${root}/.local/network.json`, JSON.stringify({url,qrPath:`${root}/public/network-qr.png`}, null, 2));
}
