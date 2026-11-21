import { useEffect } from 'react';

// Include existing primary actions in portalled sheets without coupling to a dialog API.
const SURFACES = [
  '[data-surface-light]', '.wallet-full-btn', '.ticket-primary-qr-btn',
  '.qr-done-btn', '.empty-reset-pill', '.explore-empty-reset',
  '.space-book-wa-btn', '.gear-whatsapp-cta-btn', '.organise-whatsapp-btn',
  '.pass-modal-footer .pass-subscribe-btn', '.upi-primary-pay-button',
  '.upi-confirm-paid-btn'
].join(', ');
const LIGHT_PROPERTIES = ['--surface-x', '--surface-y', '--surface-turn', '--surface-shift-x'];

export default function useSurfaceLight(appRef) {
  useEffect(() => {
    // Only run on desktop devices with a mouse/fine pointer; touch devices don't have hover/mouse reflection
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    let activeSurface = null;
    let pendingFrame = null;
    let pointerX = 0;
    let pointerY = 0;

    const clearLight = () => {
      if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
      pendingFrame = null;
      if (activeSurface) {
        activeSurface.removeAttribute('data-surface-lit');
        LIGHT_PROPERTIES.forEach(name => activeSurface.style.removeProperty(name));
      }
      activeSurface = null;
    };

    const isEnabled = () => finePointer.matches && !reducedMotion.matches && !document.hidden;

    const paintLight = () => {
      pendingFrame = null;
      if (!isEnabled() || !activeSurface?.isConnected) {
        clearLight();
        return;
      }
      const rect = activeSurface.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointerX - rect.left) / (rect.width || 1)));
      const y = Math.max(0, Math.min(1, (pointerY - rect.top) / (rect.height || 1)));
      activeSurface.style.setProperty('--surface-x', `${(x * 100).toFixed(1)}%`);
      activeSurface.style.setProperty('--surface-y', `${(y * 100).toFixed(1)}%`);
      activeSurface.style.setProperty('--surface-turn', `${((x - 0.5) * 24).toFixed(1)}deg`);
      activeSurface.style.setProperty('--surface-shift-x', `${((x - 0.5) * 4).toFixed(1)}px`);
      activeSurface.setAttribute('data-surface-lit', '');
    };

    const followPointer = event => {
      if (!isEnabled() || event.pointerType === 'touch') {
        clearLight();
        return;
      }
      const surface = event.target instanceof Element ? event.target.closest(SURFACES) : null;
      if (!surface || surface.matches(':disabled, [aria-disabled="true"]') || surface.closest('[inert]')) {
        clearLight();
        return;
      }
      if (surface !== activeSurface) {
        clearLight();
        activeSurface = surface;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pendingFrame === null) pendingFrame = requestAnimationFrame(paintLight);
    };

    const leaveSurface = event => {
      if (activeSurface && (!(event.relatedTarget instanceof Node) || !activeSurface.contains(event.relatedTarget))) {
        clearLight();
      }
    };

    // Screen swaps can also happen without a pointer click (keyboard or state updates).
    const observer = new MutationObserver(records => {
      if (activeSurface && (!activeSurface.isConnected || records.some(record =>
        record.attributeName === 'aria-current' ||
        (record.type === 'childList' && record.target instanceof Element &&
          record.target.classList.contains('eventjam-screen-viewport'))
      ))) clearLight();
    });
    if (appRef.current) observer.observe(appRef.current, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current']
    });

    document.addEventListener('pointerover', followPointer, { passive: true });
    document.addEventListener('pointermove', followPointer, { passive: true });
    document.addEventListener('pointerout', leaveSurface, { passive: true });
    document.addEventListener('pointercancel', clearLight, { passive: true });
    document.addEventListener('click', clearLight, true);
    document.addEventListener('keydown', clearLight, true);
    document.addEventListener('scroll', clearLight, true);
    document.addEventListener('visibilitychange', clearLight);
    window.addEventListener('blur', clearLight);
    window.addEventListener('popstate', clearLight);
    window.addEventListener('hashchange', clearLight);
    finePointer.addEventListener('change', clearLight);
    reducedMotion.addEventListener('change', clearLight);

    return () => {
      clearLight();
      observer.disconnect();
      document.removeEventListener('pointerover', followPointer);
      document.removeEventListener('pointermove', followPointer);
      document.removeEventListener('pointerout', leaveSurface);
      document.removeEventListener('pointercancel', clearLight);
      document.removeEventListener('click', clearLight, true);
      document.removeEventListener('keydown', clearLight, true);
      document.removeEventListener('scroll', clearLight, true);
      document.removeEventListener('visibilitychange', clearLight);
      window.removeEventListener('blur', clearLight);
      window.removeEventListener('popstate', clearLight);
      window.removeEventListener('hashchange', clearLight);
      finePointer.removeEventListener('change', clearLight);
      reducedMotion.removeEventListener('change', clearLight);
    };
  }, [appRef]);
}
