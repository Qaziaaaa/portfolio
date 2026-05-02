import { useEffect, useRef, memo, type KeyboardEvent } from 'react';
import { X, Trash2, Send, Sparkles } from 'lucide-react';
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll — only scroll if user is near the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // Focus input when ready
  useEffect(() => {
    if (status === 'ready') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [status]);

  const canSend = !isStreaming && status === 'ready' && inputValue.trim().length > 0;

  const handleSubmit = () => {
    if (!canSend) return;
    onSendMessage(inputValue.trim());
    onInputChange('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') onClose();
  };

  const lastMsg = messages[messages.length - 1];
  const showTyping = isStreaming && lastMsg?.role === 'assistant' && lastMsg.content === '';

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
      style={{
        background: 'linear-gradient(145deg, #0d0d0d 0%, #080808 100%)',
        width: 'min(400px, calc(100vw - 1.5rem))',
        height: 'min(560px, calc(100svh - 7rem))',
      }}
      role="dialog"
      aria-label="Chat with Qazi's AI assistant"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white/70" />
            </div>
            {status === 'ready' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Qazi's Assistant</p>
            <p className="text-[10px] text-white/40 mt-0.5 leading-none">
              {status === 'loading' ? 'Initializing…' : status === 'ready' ? 'Online · Ask me anything' : 'Unavailable'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
            <p className="text-xs text-white/40">Setting up your assistant…</p>
          </div>
        )}

        {/* Error states */}
        {(status === 'misconfigured' || status === 'error') && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <p className="text-sm text-white/50">
              {status === 'misconfigured'
                ? 'Chatbot is not configured. API keys are missing.'
                : 'Assistant is temporarily unavailable. Try again later.'}
            </p>
          </div>
        )}

        {/* Empty state */}
        {status === 'ready' && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-2">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-white/50" />
              </div>
              <p className="text-sm font-medium text-white/80 mb-1">Hi, I'm Qazi's AI assistant</p>
              <p className="text-xs text-white/40">Ask me about his projects, skills, or availability</p>
            </div>
            {/* Quick suggestion chips */}
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { onInputChange(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                  className="text-left text-xs text-white/60 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 rounded-xl px-3 py-2.5 transition-all"
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
        <div className="px-3 pb-3 pt-2 border-t border-white/[0.08] shrink-0">
          <div className="flex items-end gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-white/20 transition-colors">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                onInputChange(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Qazi…"
              disabled={status !== 'ready'}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder-white/25 focus:outline-none disabled:opacity-40 leading-relaxed"
              style={{ maxHeight: '96px', minHeight: '22px' }}
              aria-label="Message input"
            />
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0 hover:bg-white/90 disabled:opacity-25 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[9px] text-white/20 text-center mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
});
