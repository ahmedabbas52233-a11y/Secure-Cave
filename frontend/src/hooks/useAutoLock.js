import { useEffect, useRef, useCallback } from "react";

const EVENTS = ["mousemove", "keydown", "click", "touchstart", "scroll"];

/**
 * Locks the vault after `timeoutMs` ms of inactivity,
 * AND immediately when the tab becomes hidden.
 *
 * @param {() => void} onLock   - called when vault should lock
 * @param {number}     timeoutMs - idle timeout in ms (0 = disabled)
 */
export function useAutoLock(onLock, timeoutMs) {
  const lockRef   = useRef(onLock);
  const timerRef  = useRef(null);

  // Keep ref current without re-running effects
  useEffect(() => { lockRef.current = onLock; }, [onLock]);

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    if (timeoutMs > 0) {
      timerRef.current = setTimeout(() => lockRef.current(), timeoutMs);
    }
  }, [timeoutMs]);

  useEffect(() => {
    if (!timeoutMs) return; // 0 = disabled

    // Activity listeners
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset(); // start initial timer

    // Immediate lock on tab hide
    const onVisibility = () => { if (document.hidden) lockRef.current(); };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(timerRef.current);
      EVENTS.forEach(e => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [timeoutMs, reset]);
}
