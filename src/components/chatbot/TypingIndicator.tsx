import { memo } from 'react';

export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-5 h-5 rounded-lg bg-terra-500/10 border border-terra-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[8px] font-bold text-terra-500">Q</span>
      </div>
      <div
        className="bg-cream-200/60 border border-cream-300 rounded-2xl rounded-tl-md px-3.5 py-3 flex items-center gap-1.5"
        aria-label="Typing"
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-terra-500/40 animate-bounce"
            style={{ animationDelay: `${i * 110}ms`, animationDuration: '0.9s' }}
          />
        ))}
      </div>
    </div>
  );
});
