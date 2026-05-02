import { memo } from 'react';
import type { ChatMessage } from '../../lib/chatbot/types';

interface Props { message: ChatMessage }

function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/** Parse text into segments: plain text, URLs, bullet lines, bold (**text**), headings */
function parseContent(text: string) {
  // Split into lines first
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (li > 0) result.push(<div key={`gap-${li}`} className="h-1.5" />);
      return;
    }

    // Heading line (starts with # or ##)
    if (/^#{1,2}\s/.test(trimmed)) {
      result.push(
        <p key={li} className="font-semibold text-white text-sm mt-2 mb-0.5">
          {trimmed.replace(/^#{1,2}\s/, '')}
        </p>
      );
      return;
    }

    // Bullet line
    if (/^[•\-\*]\s/.test(trimmed)) {
      result.push(
        <div key={li} className="flex gap-2 items-start">
          <span className="text-white/40 mt-0.5 shrink-0 text-xs">▸</span>
          <span className="text-white/85 text-sm leading-relaxed">
            {renderInline(trimmed.replace(/^[•\-\*]\s/, ''))}
          </span>
        </div>
      );
      return;
    }

    // Normal paragraph
    result.push(
      <p key={li} className="text-white/85 text-sm leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  return result;
}

/** Render inline: bold (**text**) and URLs */
function renderInline(text: string): React.ReactNode[] {
  // Split on bold markers and URLs
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s,)]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 underline underline-offset-2 hover:text-white transition-colors break-all"
        >
          {display}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="bg-white text-black text-sm font-medium px-4 py-2.5 rounded-2xl rounded-br-md leading-relaxed">
            {message.content}
          </div>
          <p className="text-[10px] text-white/25 text-right mt-1 pr-1">
            {relativeTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      {/* Avatar */}
      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[9px] font-bold text-white/70">Q</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 space-y-1.5">
          {parseContent(message.content)}
        </div>
        <p className="text-[10px] text-white/25 mt-1 pl-1">
          {relativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
});
