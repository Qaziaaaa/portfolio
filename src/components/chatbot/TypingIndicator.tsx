import { memo } from 'react';

export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[9px] font-bold text-white/70">Q</span>
      </div>
      <div
        className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5"
        aria-label="Assistant is typing"
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
            style={{ animationDelay: `${i * 120}ms`, animationDuration: '0.9s' }}
          />
        ))}
      </div>
    </div>
  );
});
