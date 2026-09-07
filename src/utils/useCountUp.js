import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current animated value as a string via `format(value)`.
 */
export function useCountUp(target, duration = 1200, format = (v) => Math.round(v).toLocaleString()) {
  const [display, setDisplay] = useState('0');
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(numericTarget)) { setDisplay(target); return; }

    cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    function step(timestamp) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(format(eased * numericTarget));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}
