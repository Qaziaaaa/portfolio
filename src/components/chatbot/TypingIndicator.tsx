import { useEffect, useState } from 'react';

/**
 * Animated three-dot typing indicator shown while the assistant is streaming.
 * Respects `prefers-reduced-motion` — disables animation when the user prefers reduced motion.
 */
export function TypingIndicator() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 w-fit"
      aria-label="Assistant is typing"
      role="status"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full bg-white/60 ${
            reducedMotion ? '' : 'animate-bounce'
          }`}
          style={
            reducedMotion
              ? undefined
              : { animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }
          }
        />
      ))}
    </div>
  );
}
