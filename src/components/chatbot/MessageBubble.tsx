import { memo } from 'react';
import type { ChatMessage } from '../../lib/chatbot/types';

interface Props { message: ChatMessage }

function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s,)>\]]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 text-coral hover:text-coral-dark transition-colors break-all">
          {display}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function parseContent(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t) {
      if (i > 0) nodes.push(<div key={`sp-${i}`} className="h-1" />);
      return;
    }
    if (/^#{1,2}\s/.test(t)) {
      nodes.push(
        <p key={i} className="font-semibold text-ink text-[13px] mt-1.5 mb-0.5">
          {t.replace(/^#{1,2}\s/, '')}
        </p>
      );
      return;
    }
    if (/^[•\-*]\s/.test(t)) {
      nodes.push(
        <div key={i} className="flex gap-2 items-start">
          <span className="text-coral shrink-0 mt-0.5 text-[10px] leading-[1.6]">▸</span>
          <span className="text-[13px] leading-relaxed">{renderInline(t.replace(/^[•\-*]\s/, ''))}</span>
        </div>
      );
      return;
    }
    nodes.push(
      <p key={i} className="text-[13px] leading-relaxed">
        {renderInline(t)}
      </p>
    );
  });

  return nodes;
}

export const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="chat-bubble-user">
            {message.content}
          </div>
          <p className="chat-time text-right mt-1 pr-1">
            {relativeTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="chat-avatar chat-avatar-sm shrink-0 mt-1">Q</div>
      <div className="flex-1 min-w-0">
        <div className="chat-bubble-bot">
          {parseContent(message.content)}
        </div>
        <p className="chat-time mt-1 pl-1">
          {relativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
});
