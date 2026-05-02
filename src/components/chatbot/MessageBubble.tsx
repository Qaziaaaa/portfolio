import type { ChatMessage } from '../../lib/chatbot/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

/** Returns a human-readable relative time string (e.g. "just now", "2m ago"). */
function relativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Renders a single chat message bubble.
 * - User messages: right-aligned, white background, black text.
 * - Assistant messages: left-aligned, dark background, white text.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-white text-black rounded-2xl rounded-br-sm'
            : 'bg-white/5 text-white border border-white/10 rounded-2xl rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-white/30 px-1">
        {relativeTime(message.timestamp)}
      </span>
    </div>
  );
}
