import React, { useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, useIsPresent } from 'motion/react';

const managers = new WeakMap();
const focusableSelector = 'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, [contenteditable]:not([contenteditable="false"]), [tabindex]';

function canFocus(element) {
  if (!element?.isConnected || element.matches(':disabled, [aria-disabled="true"]') || element.closest('[inert], [hidden]')) return false;
  const style = element.ownerDocument.defaultView.getComputedStyle(element);
  return element.getClientRects().length > 0 && style.visibility !== 'hidden' && style.visibility !== 'collapse';
}

function focusElement(element, preventScroll = true) {
  if (!canFocus(element)) return false;
  element.focus({ preventScroll });
  return element.ownerDocument.activeElement === element;
}

function tabStops(dialog) {
  // Read the live DOM: filters and quantity steppers replace controls while open.
  return [...dialog.querySelectorAll(focusableSelector)]
    .filter(element => element.tabIndex >= 0 && canFocus(element))
    .sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
}

function focusEntry(entry) {
  const preferred = entry.dialog.querySelector('[data-dialog-initial-focus]');
  if (!focusElement(preferred) && !focusElement(tabStops(entry.dialog)[0])) focusElement(entry.dialog);
}

function createManager(document) {
  const entries = [];
  const inertStates = new Map();
  let scrollStates = [];
  let observer;

  function restoreInert(element, previous) {
    if (previous === null) element.removeAttribute('inert');
    else element.setAttribute('inert', previous);
  }

  function syncBackground() {
    const top = entries.at(-1);
    for (const element of document.body.children) {
      if (!inertStates.has(element)) inertStates.set(element, element.getAttribute('inert'));
      if (element === top?.portal) restoreInert(element, inertStates.get(element));
      else element.setAttribute('inert', '');
    }
  }

  function onKeyDown(event) {
    const top = entries.at(-1);
    if (!top || event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      top.close();
    } else if (event.key === 'Tab') {
      const stops = tabStops(top.dialog);
      const current = stops.indexOf(document.activeElement);
      const next = event.shiftKey
        ? (current <= 0 ? stops.length - 1 : current - 1)
        : (current < 0 || current === stops.length - 1 ? 0 : current + 1);
      event.preventDefault();
      focusElement(stops[next] || top.dialog, false);
    }
  }

  function onFocusIn(event) {
    const top = entries.at(-1);
    if (top && !top.dialog.contains(event.target)) focusEntry(top);
  }

  return {
    add(entry) {
      entry.opener = document.activeElement;
      if (entries.length === 0) {
        scrollStates = [document.documentElement, document.body].map(element => ({
          element,
          properties: ['overflow', 'overflow-x', 'overflow-y'].map(name => ({
            name,
            value: element.style.getPropertyValue(name),
            priority: element.style.getPropertyPriority(name),
          })),
        }));
        for (const { element } of scrollStates) element.style.setProperty('overflow', 'hidden', 'important');
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('focusin', onFocusIn, true);
        observer = new MutationObserver(syncBackground);
        observer.observe(document.body, { childList: true });
      }
      entries.push(entry);
      // Match paint order to focus order, including simultaneously open sheets.
      document.body.appendChild(entry.portal);
      syncBackground();
      focusEntry(entry);

      return () => {
        const index = entries.indexOf(entry);
        if (index === -1) return;
        const wasTop = index === entries.length - 1;
        entries.splice(index, 1);
        // A parent may disappear before its child: retain the original opener.
        for (const remaining of entries) {
          if (entry.dialog.contains(remaining.opener)) remaining.opener = entry.opener;
        }
        if (entries.length) {
          syncBackground();
        } else {
          observer.disconnect();
          document.removeEventListener('keydown', onKeyDown, true);
          document.removeEventListener('focusin', onFocusIn, true);
          for (const [element, previous] of inertStates) restoreInert(element, previous);
          inertStates.clear();
          for (const { element, properties } of scrollStates) {
            for (const { name } of properties) element.style.removeProperty(name);
            for (const { name, value, priority } of properties) {
              if (value) element.style.setProperty(name, value, priority);
            }
          }
          scrollStates = [];
        }
        if (wasTop) {
          const top = entries.at(-1);
          if ((!top || top.dialog.contains(entry.opener)) && focusElement(entry.opener)) return;
          if (top) focusEntry(top);
        }
      };
    },
  };
}

function DialogLifecycle({ children, onClose, titleId }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  const presentRef = useRef(true);
  closeRef.current = onClose;
  presentRef.current = useIsPresent();

  useLayoutEffect(() => {
    const document = dialogRef.current.ownerDocument;
    if (!managers.has(document)) managers.set(document, createManager(document));
    return managers.get(document).add({
      dialog: dialogRef.current,
      portal: dialogRef.current.closest('[data-dialog-portal]'),
      close: () => { if (presentRef.current) closeRef.current(); },
    });
  }, []);

  return children({
    titleId,
    dialogProps: { ref: dialogRef, role: 'dialog', 'aria-modal': true, 'aria-labelledby': titleId, tabIndex: -1 },
  });
}

export default function AccessibleDialog({ isOpen, onClose, children }) {
  const titleId = useId();
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div data-dialog-portal="" style={{ display: 'contents' }}>
      <AnimatePresence>
        {isOpen && (
          <DialogLifecycle key="dialog" onClose={onClose} titleId={titleId}>
            {children}
          </DialogLifecycle>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
