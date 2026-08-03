import { useEffect, useRef, memo, type KeyboardEvent } from 'react';
import { X, Trash2, Send, Bot } from 'lucide-react';
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

  return (
    <div
      className={[
        'flex flex-col bg-[#faf8f4]',
        // Mobile: rounded on all sides since it floats above the toggle
        'rounded-2xl border border-[rgba(0,0,0,0.08)] mx-3 sm:mx-0',
        // Desktop: fully rounded floating card
        'sm:rounded-2xl sm:border sm:border-[rgba(0,0,0,0.08)] sm:mx-0',
        'shadow-[0_20px_60px_rgba(0,0,0,0.12)]',
        // Height: mobile = fills space above toggle button, desktop = capped to viewport
        'h-[calc(100svh-5.5rem)] sm:h-[min(520px,calc(100svh-6rem))]',
      ].join(' ')}
      role="dialog"
      aria-label="Chat with Qazi's AI assistant"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(0,0,0,0.08)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-terra-500/10 border border-terra-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-terra-500" />
            </div>
            {status === 'ready' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#faf8f4]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-charcoal-900 leading-none">Qazi&apos;s Assistant</p>
            <p className="text-[11px] text-charcoal-800/60 mt-0.5 leading-none truncate">
              {status === 'loading' ? 'Initializing…'
                : status === 'ready' ? 'Ask me anything about Qazi'
                : 'Unavailable'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 rounded-lg text-charcoal-800/30 hover:text-charcoal-800/70 hover:bg-cream-200 transition-all"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-charcoal-800/30 hover:text-charcoal-800/70 hover:bg-cream-200 transition-all"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-cream-400 border-t-terra-500 animate-spin" />
            <p className="text-xs text-charcoal-800/40">Setting up assistant…</p>
          </div>
        )}

        {/* Error */}
        {(status === 'misconfigured' || status === 'error') && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-lg">⚠️</div>
            <p className="text-xs text-charcoal-800/70 leading-relaxed">
              {status === 'misconfigured'
                ? 'API keys are not configured. Please set environment variables.'
                : 'Assistant is temporarily unavailable. Please try again later.'}
            </p>
          </div>
        )}

        {/* Empty state */}
        {status === 'ready' && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-2">
            <div className="text-center">
              <div className="w-11 h-11 rounded-2xl bg-terra-500/10 border border-terra-500/20 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-5 h-5 text-terra-500" />
              </div>
              <p className="text-sm font-medium text-charcoal-900 mb-1">Hi, I&apos;m Qazi&apos;s assistant</p>
              <p className="text-xs text-charcoal-800/50">Ask me about his work, skills, or availability</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onInputChange(s);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="text-left text-xs text-charcoal-800/80 bg-cream-200/60 hover:bg-cream-200 border border-cream-300 hover:border-cream-400 rounded-xl px-3.5 py-2.5 transition-all leading-relaxed"
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
        <div className="px-3 pb-4 pt-2 shrink-0 border-t border-[rgba(0,0,0,0.08)]">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-cream-200/60 border border-cream-300 rounded-xl px-3 py-2.5 focus-within:border-terra-400 transition-colors">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Qazi…"
                disabled={status !== 'ready'}
                rows={1}
                className="w-full resize-none bg-transparent text-[13px] text-charcoal-900 placeholder-charcoal-800/35 focus:outline-none disabled:opacity-40 leading-relaxed"
                style={{ maxHeight: '100px', minHeight: '20px' }}
                aria-label="Message"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-9 h-9 rounded-xl bg-terra-500 text-white flex items-center justify-center shrink-0 hover:bg-terra-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 mb-0.5"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[9px] text-charcoal-800/30 text-center mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
});
