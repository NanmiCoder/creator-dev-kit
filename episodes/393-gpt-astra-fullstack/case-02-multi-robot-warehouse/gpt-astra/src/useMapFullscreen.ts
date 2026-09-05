import { useCallback, useEffect, useRef, useState } from 'react';

// Native fullscreen when supported; embedded browsers still get a full-viewport
// map if their host disallows the Fullscreen API.
export function useMapFullscreen() {
  const panelRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const hadNativeFullscreen = useRef(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const exit = useCallback(() => {
    setExpanded(false);
    if (document.fullscreenElement === panelRef.current) void document.exitFullscreen().catch(() => {});
  }, []);
  const toggle = useCallback(() => {
    if (expanded) { exit(); return; }
    previousFocus.current = document.activeElement as HTMLElement | null;
    setExpanded(true);
    if (panelRef.current?.requestFullscreen && document.fullscreenEnabled) {
      void panelRef.current.requestFullscreen().catch(() => { /* Keep the viewport fallback. */ });
    }
  }, [expanded, exit]);
  useEffect(() => {
    const change = () => {
      const native = document.fullscreenElement === panelRef.current;
      if (hadNativeFullscreen.current && !native) setExpanded(false);
      hadNativeFullscreen.current = native;
    };
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if ((event.target as Element)?.closest('.modal')) return;
      if (event.key === 'Escape') { event.preventDefault(); exit(); }
      if (event.key === 'Tab') {
        const elements = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), select:not(:disabled), [tabindex="0"]');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', keydown);
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [expanded, exit]);
  return { panelRef, expanded, toggle };
}
