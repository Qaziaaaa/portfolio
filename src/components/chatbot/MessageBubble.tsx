import type { ChatMessage } from '../../lib/chatbot/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

function relativeTime(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Renders a URL as a clickable link inside message text.
 * Splits text on URLs and wraps them in <a> tags.
 */
function renderContent(text: string, isUser: boolean) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 ${isUser ? 'text-black/70 hover:text-black' : 'text-white/80 hover:text-white'}`}
        >
          {part.replace(/^https?:\/\//, '')}
        </a>
      );
    }
    // Render bullet points as proper list items
    if (part.includes('\n')) {
      return part.split('\n').map((line, j) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          return (
            <div key={`${i}-${j}`} className="flex gap-2 mt-1">
              <span className="shrink-0 mt-0.5 opacity-60">•</span>
              <span>{trimmed.replace(/^[•\-]\s*/, '')}</span>
            </div>
          );
        }
        if (trimmed === '') return j > 0 ? <div key={`${i}-${j}`} className="h-1" /> : null;
        return <span key={`${i}-${j}`}>{line}</span>;
      });
    }
    return <span key={i}>{part}</span>;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && (
        <div className="flex items-center gap-1.5 px-1 mb-0.5">
          <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-[8px]">Q</span>
          </div>
          <span className="text-[10px] text-white/40 font-medium">Qazi's Assistant</span>
        </div>
      )}
      <div
        className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-white text-black rounded-2xl rounded-br-sm font-medium'
            : 'bg-white/5 text-white/90 border border-white/10 rounded-2xl rounded-bl-sm'
        }`}
      >
        {renderContent(message.content, isUser)}
      </div>
      <span className="text-[10px] text-white/25 px-1">
        {relativeTime(message.timestamp)}
      </span>
    </div>
  );
}
