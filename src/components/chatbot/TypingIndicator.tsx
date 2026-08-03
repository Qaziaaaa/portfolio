import { memo } from 'react';

export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="chat-avatar chat-avatar-sm shrink-0 mt-1">Q</div>
      <div
        className="chat-bubble-bot flex items-center gap-1.5"
        aria-label="Writing"
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce"
            style={{ animationDelay: `${i * 110}ms`, animationDuration: '0.9s' }}
          />
        ))}
        <span className="chat-sub ml-1">writing…</span>
      </div>
    </div>
  );
});
