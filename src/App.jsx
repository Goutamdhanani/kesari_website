import React, { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import MobileFrame from './components/mobile/MobileFrame';
import useSurfaceLight from './hooks/useSurfaceLight';
import './App.css';

export default function App() {
  const appRef = useRef(null);
  useSurfaceLight(appRef);

  return (
    <MotionConfig reducedMotion="user">
      <div className="eventjam-root-app" ref={appRef}>
        <MobileFrame initialScreen="home" initialEventId="rock" />
      </div>
    </MotionConfig>
  );
}
