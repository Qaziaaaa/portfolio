import { useEffect, useRef, memo, type KeyboardEvent } from 'react';
import { X, Trash2, Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, InitStatus } from '../../lib/chatbot/types';

interface Props {
  messages: ChatMessage[];
  status: InitStatus;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

const SUGGESTIONS = [
  "What projects has Qazi built?",
  "What's Qazi's tech stack?",
  "Is Qazi available for hire?",
];

export const ChatPanel = memo(function ChatPanel({
  messages, status, isStreaming,
  onSendMessage, onClearHistory, onClose,
  inputValue, onInputChange,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // Focus input when ready
  useEffect(() => {
    if (status === 'ready') setTimeout(() => inputRef.current?.focus(), 80);
  }, [status]);

  const canSend = !isStreaming && status === 'ready' && inputValue.trim().length > 0;

  const handleSubmit = () => {
    if (!canSend) return;
    onSendMessage(inputValue.trim());
    onInputChange('');
    // Reset textarea height
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') onClose();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const lastMsg = messages[messages.length - 1];
  const showTyping = isStreaming && lastMsg?.role === 'assistant' && lastMsg.content === '';

  const sub = status === 'loading'
    ? 'warming up my notebook…'
    : status === 'ready'
      ? 'ask me anything about Qazi'
      : 'hmm, I ran out of paper';

  return (
    <div
      className={[
        'chat-panel flex flex-col',
        // Height: mobile = fills space above toggle button, desktop = capped to viewport
        'h-[calc(100svh-5.5rem)] sm:h-[min(540px,calc(100svh-6rem))]',
      ].join(' ')}
      role="dialog"
      aria-label="Chat with Qazi's AI assistant"
    >
      {/* ── Header ── */}
      <header className="chat-head shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="chat-avatar">Q</div>
            {status === 'ready' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sage border-2 border-cream-card" />
            )}
          </div>
          <div className="min-w-0">
            <p className="chat-who">Qazi&apos;s assistant</p>
            <p className="chat-sub mt-1">{sub}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onClearHistory}
            disabled={messages.length === 0}
            className="p-2 rounded-lg text-ink-soft/60 hover:text-ink hover:bg-cream-paper transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-ink-soft/60 hover:text-ink hover:bg-cream-paper transition-all"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-3 overscroll-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-9 h-9 rounded-full border-[3px] border-terra-500/15 border-t-terra-500 animate-spin" />
            <p className="chat-sub">warming up my notebook…</p>
          </div>
        )}

        {/* Error */}
        {(status === 'misconfigured' || status === 'error') && (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="chat-note-err">
              {status === 'misconfigured'
                ? 'I’m missing my API keys — add them to the .env file and reload.'
                : 'I tripped over my crayons. Please try again in a moment.'}
            </div>
          </div>
        )}

        {/* Empty state */}
        {status === 'ready' && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-2">
            <div className="chat-polaroid">
              <p className="hi">hi, I&apos;m Qazi&apos;s assistant!</p>
            </div>
            <p className="chat-hint text-center">tap a question below, or write your own</p>
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onInputChange(s);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="chat-chip"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {status === 'ready' && messages.length > 0 && (
          <>
            {messages.map((msg) =>
              msg.role === 'assistant' && msg.content === '' && isStreaming
                ? null
                : <MessageBubble key={msg.id} message={msg} />
            )}
            {showTyping && <TypingIndicator />}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      {(status === 'ready' || status === 'loading') && (
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="flex items-end gap-2">
            <div className="chat-inputwrap flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Qazi…"
                disabled={status !== 'ready'}
                rows={1}
                className="w-full resize-none bg-transparent text-[13px] text-ink placeholder-ink-soft/40 focus:outline-none disabled:opacity-40 leading-relaxed"
                style={{ maxHeight: '100px', minHeight: '20px' }}
                aria-label="Message"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-10 h-10 rounded-full bg-terra-500 text-white flex items-center justify-center shrink-0 hover:bg-terra-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 mb-0.5"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="chat-time text-center mt-2">
            enter to send · shift+enter for a new line
          </p>
        </div>
      )}
    </div>
  );
});
