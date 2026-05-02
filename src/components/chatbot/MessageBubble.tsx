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
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 text-white/60 hover:text-white/90 transition-colors break-all">
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
        <p key={i} className="font-semibold text-white/90 text-[13px] mt-1.5 mb-0.5">
          {t.replace(/^#{1,2}\s/, '')}
        </p>
      );
      return;
    }
    if (/^[•\-\*]\s/.test(t)) {
      nodes.push(
        <div key={i} className="flex gap-2 items-start">
          <span className="text-white/30 shrink-0 mt-0.5 text-[10px] leading-[1.6]">▸</span>
          <span className="text-[13px] text-white/75 leading-relaxed">{renderInline(t.replace(/^[•\-\*]\s/, ''))}</span>
        </div>
      );
      return;
    }
    nodes.push(
      <p key={i} className="text-[13px] text-white/75 leading-relaxed">
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
        <div className="max-w-[78%]">
          <div className="bg-white text-black text-[13px] font-medium px-3.5 py-2.5 rounded-2xl rounded-br-md leading-relaxed">
            {message.content}
          </div>
          <p className="text-[9px] text-white/20 text-right mt-1 pr-0.5">
            {relativeTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-5 h-5 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[8px] font-bold text-white/50">Q</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-tl-md px-3.5 py-3 space-y-1">
          {parseContent(message.content)}
        </div>
        <p className="text-[9px] text-white/20 mt-1 pl-0.5">
          {relativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
});
