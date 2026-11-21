import React, { useRef, useEffect } from 'react';

/**
 * AuroraFluidCanvas
 * The existing curtain movement, in a restrained blue-violet palette.
 * Reduced motion gets a still composition; hidden tabs do not draw frames.
 */
export default function AuroraFluidCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let lastTimestamp = null;
    let width = 0;
    let height = 0;
    let time = 1400;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Handle high-DPI retina displays
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(width * dpr, 100);
      canvas.height = Math.max(height * dpr, 100);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      if (!document.hidden) draw();
    };

    // 4 Distinct Northern Lights Fluid Ribbon Curtains
    const ribbons = [
      {
        // Reflected silver-blue
        baseY: 0.32,
        amplitude: 32,
        speed: 0.00045,
        freq: 0.007,
        phase: 0,
        gradientStart: 'rgba(125, 151, 224, 0.30)',
        gradientMid: 'rgba(98, 122, 199, 0.14)',
        gradientTop: 'rgba(98, 122, 199, 0)',
        rayColor: 'rgba(154, 175, 232, 0.20)',
        curtainHeight: 140,
        rayCount: 42
      },
      {
        // Cool blue depth
        baseY: 0.40,
        amplitude: 28,
        speed: 0.00035,
        freq: 0.009,
        phase: 2.1,
        gradientStart: 'rgba(82, 105, 208, 0.30)',
        gradientMid: 'rgba(67, 91, 172, 0.16)',
        gradientTop: 'rgba(67, 91, 172, 0)',
        rayColor: 'rgba(113, 142, 216, 0.18)',
        curtainHeight: 160,
        rayCount: 38
      },
      {
        // Soft violet crest
        baseY: 0.22,
        amplitude: 38,
        speed: 0.00028,
        freq: 0.006,
        phase: 4.3,
        gradientStart: 'rgba(147, 136, 216, 0.28)',
        gradientMid: 'rgba(121, 114, 190, 0.13)',
        gradientTop: 'rgba(121, 114, 190, 0)',
        rayColor: 'rgba(169, 165, 247, 0.18)',
        curtainHeight: 180,
        rayCount: 35
      },
      {
        // Low slate reflection
        baseY: 0.48,
        amplitude: 24,
        speed: 0.0005,
        freq: 0.011,
        phase: 1.2,
        gradientStart: 'rgba(104, 132, 176, 0.20)',
        gradientMid: 'rgba(83, 105, 153, 0.10)',
        gradientTop: 'rgba(83, 105, 153, 0)',
        rayColor: 'rgba(132, 155, 196, 0.14)',
        curtainHeight: 130,
        rayCount: 30
      }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Additive screen blend mode makes overlapping aurora waves ignite with light
      ctx.globalCompositeOperation = 'screen';

      ribbons.forEach((ribbon) => {
        const baseY = height * ribbon.baseY;
        const waveStep = 6;
        const points = [];

        // Calculate smooth undulating ribbon baseline using superposition of waves
        for (let x = -20; x <= width + 20; x += waveStep) {
          const t = time * ribbon.speed;
          const y =
            baseY +
            Math.sin(x * ribbon.freq + t + ribbon.phase) * ribbon.amplitude +
            Math.cos(x * (ribbon.freq * 0.65) - t * 0.8) * (ribbon.amplitude * 0.55) +
            Math.sin(x * 0.02 + t * 1.5) * 6; // fine high-frequency flutter

          points.push({ x, y });
        }

        if (points.length < 2) return;

        // A) Draw Vertical Magnetic Auroral Rays (The iconic Northern Lights "curtain" look)
        const rayStep = width / ribbon.rayCount;
        for (let r = 0; r < ribbon.rayCount; r++) {
          const rayX = r * rayStep + Math.sin(time * 0.001 + r) * 6;
          const t = time * ribbon.speed;
          const rayBaseY =
            baseY +
            Math.sin(rayX * ribbon.freq + t + ribbon.phase) * ribbon.amplitude +
            Math.cos(rayX * (ribbon.freq * 0.65) - t * 0.8) * (ribbon.amplitude * 0.55);

          // Ray oscillates upward into the night sky
          const rayLength =
            ribbon.curtainHeight * (0.6 + 0.4 * Math.sin(r * 0.45 + time * 0.002));
          const rayAlpha =
            0.07 + 0.10 * Math.sin(r * 0.6 + time * 0.0025);

          if (rayAlpha > 0.05) {
            const rayGrad = ctx.createLinearGradient(rayX, rayBaseY, rayX, rayBaseY - rayLength);
            rayGrad.addColorStop(0, ribbon.rayColor.replace(/[\d\.]+\)$/, `${rayAlpha})`));
            rayGrad.addColorStop(0.5, ribbon.gradientMid.replace(/[\d\.]+\)$/, `${rayAlpha * 0.5})`));
            rayGrad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = rayGrad;
            ctx.fillRect(rayX - 1.5, rayBaseY - rayLength, 3, rayLength);
          }
        }

        // B) Draw the Continuous Fluid Ribbon Curtain
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        // Complete the filled polygon up to the curtain apex
        ctx.lineTo(width + 20, 0);
        ctx.lineTo(-20, 0);
        ctx.closePath();

        const curtainGrad = ctx.createLinearGradient(0, baseY + ribbon.amplitude, 0, baseY - ribbon.curtainHeight);
        curtainGrad.addColorStop(0, ribbon.gradientStart);
        curtainGrad.addColorStop(0.45, ribbon.gradientMid);
        curtainGrad.addColorStop(1, ribbon.gradientTop);

        ctx.fillStyle = curtainGrad;
        ctx.fill();

        // C) Draw luminous bottom edge filament line of the aurora ribbon
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = ribbon.gradientStart;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

    };

    const render = (timestamp) => {
      animationFrameId = null;
      if (document.hidden || motionPreference.matches) return;
      if (lastTimestamp !== null) time += Math.min(timestamp - lastTimestamp, 40);
      lastTimestamp = timestamp;
      draw();
      animationFrameId = requestAnimationFrame(render);
    };

    const syncPlayback = () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      lastTimestamp = null;
      if (document.hidden) return;
      draw();
      if (!motionPreference.matches) animationFrameId = requestAnimationFrame(render);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener('visibilitychange', syncPlayback);
    motionPreference.addEventListener('change', syncPlayback);
    syncPlayback();

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      motionPreference.removeEventListener('change', syncPlayback);
    };
  }, []);

  return (
    <div className={`aurora-fluid-viewport ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="aurora-fluid-canvas" />
      <div className="aurora-fluid-vignette" />
      <div className="aurora-fluid-glass-gloss" />
    </div>
  );
}
