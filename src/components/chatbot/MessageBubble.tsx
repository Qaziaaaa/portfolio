import { memo } from 'react';
import { Mail, Phone } from 'lucide-react';
import type { ChatMessage } from '../../lib/chatbot/types';
import type { Block, ProjectCardBlock, ContactCardBlock } from '../../lib/chatbot/agentClient';

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

function ProjectCard({ block }: { block: ProjectCardBlock }) {
  const hasLive = Boolean(block.href) && block.href !== block.repo;
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="text-base leading-none" aria-hidden="true">{block.emoji}</span>
        <p className="text-[13px] font-semibold text-ink leading-snug">{block.title}</p>
      </div>
      <p className="text-[12.5px] leading-relaxed text-ink-soft mt-1.5">{block.summary}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {block.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10.5px] leading-none px-1.5 py-1.5 rounded-full bg-cream-paper text-ink-soft border border-line"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-3 mt-2.5 text-[12px]">
        {hasLive && (
          <a href={block.href} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 text-coral hover:text-coral-dark transition-colors">
            live demo
          </a>
        )}
        <a href={block.repo} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 text-coral hover:text-coral-dark transition-colors">
          {hasLive ? 'source code' : 'view project'}
        </a>
      </div>
    </div>
  );
}

function ContactCard({ block }: { block: ContactCardBlock }) {
  const waDigits = block.phone ? block.phone.replace(/[^0-9]/g, '') : null;
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <p className="text-[13px] font-semibold text-ink leading-snug">{block.headline}</p>
      <div className="mt-2 space-y-1.5">
        <a href={`mailto:${block.email}`}
          className="flex items-center gap-1.5 text-[12.5px] underline underline-offset-2 text-coral hover:text-coral-dark transition-colors break-all">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          {block.email}
        </a>
        {block.phone && waDigits && (
          <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12.5px] underline underline-offset-2 text-coral hover:text-coral-dark transition-colors">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            {block.phone}
          </a>
        )}
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <p className="text-[13px] leading-relaxed">{renderInline(block.content)}</p>;
    case 'bullets':
      return (
        <div className="space-y-1">
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-coral shrink-0 mt-0.5 text-[10px] leading-[1.6]">▸</span>
              <span className="text-[13px] leading-relaxed">{renderInline(item)}</span>
            </div>
          ))}
        </div>
      );
    case 'project_card':
      return <ProjectCard block={block} />;
    case 'contact_card':
      return <ContactCard block={block} />;
  }
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

  const hasBlocks = Boolean(message.blocks?.length);
  const trace = message.trace ?? [];
  const sources = message.sources ?? [];

  return (
    <div className="flex gap-2 items-start">
      <div className="chat-avatar chat-avatar-sm shrink-0 mt-1">Q</div>
      <div className="flex-1 min-w-0">
        <div className="chat-bubble-bot">
          {hasBlocks ? (
            <div className="space-y-2.5">
              {message.blocks!.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          ) : (
            parseContent(message.content)
          )}
        </div>
        <p className="chat-time mt-1 pl-1">
          {relativeTime(message.timestamp)}
          {trace.length > 0 && <> · {trace.join(' · ')}</>}
        </p>
        {sources.length > 0 && (
          <p className="chat-time pl-1 opacity-70">sources: {sources.join(', ')}</p>
        )}
      </div>
    </div>
  );
});
