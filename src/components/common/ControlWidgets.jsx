import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import AppIcon from './AppIcon';
import './ControlWidgets.css';

// 1. 4x4 Icon Grid Matrix (from Slide 1 top-left)
export function IconGridMatrix() {
  const [activeIcon, setActiveIcon] = useState(null);
  const reduceMotion = useReducedMotion();

  const icons = [
    { id: 'home', name: 'home' },
    { id: 'search', name: 'search' },
    { id: 'calendar', name: 'calendar' },
    { id: 'arrow-up-right', name: 'arrow-up-right' },
    { id: 'chevron-left', name: 'chevron-left' },
    { id: 'chevron-right', name: 'chevron-right' },
    { id: 'share', name: 'share' },
    { id: 'pin', name: 'pin' },
    { id: 'heart', name: 'heart' },
    { id: 'ticket', name: 'ticket' },
    { id: 'coupon', name: 'coupon' },
    { id: 'bell', name: 'bell' },
    { id: 'power', name: 'power' },
    { id: 'qr', name: 'qr' },
    { id: 'waveform', name: 'waveform' },
    { id: 'music', name: 'music' }
  ];

  return (
    <div className="icon-grid-matrix-4x4">
      {icons.map((item) => (
        <motion.button
          key={item.id}
          className={`matrix-icon-btn ${activeIcon === item.id ? 'active' : ''}`}
          onClick={() => setActiveIcon(item.id)}
          whileHover={reduceMotion ? undefined : { scale: 1.035, backgroundColor: activeIcon === item.id ? '#DAFB71' : '#F8FAFC' }}
          whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
          type="button"
          aria-label={item.name.replaceAll('-', ' ')}
          aria-pressed={activeIcon === item.id}
          title={item.name}
        >
          <AppIcon name={item.name} size={20} color="#080808" strokeWidth={2} />
        </motion.button>
      ))}
    </div>
  );
}

// 2. User Profile Pill Bar (Gregory + San Francisco + Bell)
export function UserProfileBar({
  avatar = "/assets/gregory_face.png",
  location = "San Francisco",
  unreadNotifications = true,
  theme = "blue", // "blue" | "white"
  onNotificationClick = () => {},
  onProfileClick = () => {}
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div 
      className={`user-profile-pill-bar theme-${theme}`}
      whileHover={reduceMotion ? undefined : { y: -2 }}
    >
      {/* Avatar */}
      <button type="button" className="profile-avatar-wrap" onClick={onProfileClick} aria-label="Gregory's profile" title="Gregory's Profile">
        <img src={avatar} alt="Gregory" className="profile-avatar-img" />
      </button>

      {/* Location */}
      <div className="profile-location-wrap">
        <AppIcon 
          name="pin" 
          size={14} 
          color={theme === 'blue' ? '#FFFFFF' : '#080808'} 
          strokeWidth={2.5} 
        />
        <span className="profile-location-text">{location}</span>
      </div>

      {/* Bell Notification Button */}
      <motion.button 
        className="profile-bell-btn" 
        onClick={onNotificationClick}
        whileHover={reduceMotion ? undefined : { scale: 1.035 }}
        whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
        type="button"
        aria-label="Notifications"
      >
        <AppIcon name="bell" size={18} color="#080808" strokeWidth={2} />
        {unreadNotifications && <span className="bell-red-badge-dot"></span>}
      </motion.button>
    </motion.div>
  );
}

// 3. Carousel Controls & QR Code Row
export function CarouselAndQRControls({
  activeIndex = 1,
  totalSlides = 3,
  onPrev = () => {},
  onNext = () => {},
  onShowQR = () => {}
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="carousel-qr-controls-block">
      {/* Top Carousel Navigation */}
      <div className="carousel-nav-row">
        <motion.button 
          className="carousel-arrow-btn prev" 
          onClick={onPrev} 
          aria-label="Previous"
          whileHover={reduceMotion ? undefined : { scale: 1.035 }}
          whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
          type="button"
        >
          <AppIcon name="chevron-left" size={18} color="#FFFFFF" strokeWidth={2.5} />
        </motion.button>

        <div className="carousel-dots-indicator">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <span 
              key={idx} 
              className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <motion.button 
          className="carousel-arrow-btn next lime-btn" 
          onClick={onNext} 
          aria-label="Next"
          whileHover={reduceMotion ? undefined : { scale: 1.035 }}
          whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
          type="button"
        >
          <AppIcon name="chevron-right" size={18} color="#080808" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Middle QR Action Row */}
      <div className="qr-action-row">
        <motion.button 
          className="power-dark-circle-btn" 
          aria-label="Toggle Power"
          whileHover={reduceMotion ? undefined : { scale: 1.035 }}
          whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
          type="button"
        >
          <AppIcon name="power" size={18} color="#FFFFFF" strokeWidth={2} />
        </motion.button>

        <motion.button 
          className="show-qr-lime-pill-btn" 
          type="button"
          data-surface-light="control"
          onClick={onShowQR}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
        >
          <div className="qr-icon-sq">
            <AppIcon name="qr" size={18} color="#080808" strokeWidth={2.5} />
          </div>
          <span className="show-qr-label">Show QR Code</span>
          <span className="qr-triple-chevrons">›››</span>
        </motion.button>
      </div>
    </div>
  );
}

// Five destinations in the existing floating capsule.
export function FloatingBottomNav({
  activeTab = 'home',
  onTabChange = () => {}
}) {
  const reduceMotion = useReducedMotion();
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'calendar', icon: 'calendar', label: 'Schedule' },
    { id: 'ticket', icon: 'ticket', label: 'Passes' },
    { id: 'profile', icon: 'user', label: 'Profile' }
  ];

  return (
    <nav className="floating-bottom-nav-bar" aria-label="Venue Navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            className={`nav-tab-item ${isActive ? 'active-dark-tab' : 'inactive-tab'}`}
            type="button"
            data-surface-light={isActive ? 'orb' : undefined}
            onClick={() => onTabChange(tab.id)}
            whileHover={reduceMotion ? undefined : { scale: 1.035 }}
            whileTap={reduceMotion ? { opacity: 0.86 } : { scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.3, 1] }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <AppIcon 
              name={tab.icon} 
              size={19}
              color="currentColor"
              strokeWidth={isActive ? 2 : 1.8}
            />
          </motion.button>
        );
      })}
    </nav>
  );
}
