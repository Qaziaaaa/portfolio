import { memo } from 'react';

export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-5 h-5 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[8px] font-bold text-white/50">Q</span>
      </div>
      <div
        className="bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-tl-md px-3.5 py-3 flex items-center gap-1.5"
        aria-label="Typing"
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/35 animate-bounce"
            style={{ animationDelay: `${i * 110}ms`, animationDuration: '0.9s' }}
          />
        ))}
      </div>
    </div>
  );
});
