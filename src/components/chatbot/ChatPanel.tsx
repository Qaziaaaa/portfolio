import { useEffect, useRef, memo, type KeyboardEvent } from 'react';
import { X, Trash2, Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import Doodle from '../Doodle';
import type { ChatMessage } from '../../lib/chatbot/types';

interface Props {
  messages: ChatMessage[];
  isBusy: boolean;
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
  messages, isBusy,
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

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const canSend = !isBusy && inputValue.trim().length > 0;

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

  const handleSuggestion = (text: string) => {
    if (isBusy) return;
    onSendMessage(text);
    onInputChange('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const lastMsg = messages[messages.length - 1];
  const showTyping = isBusy && lastMsg?.role === 'assistant' && lastMsg.content === '';

  const followUps = !isBusy && lastMsg?.role === 'assistant'
    ? (lastMsg.suggestions ?? [])
    : [];

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
          <div className="shrink-0">
            <div className="chat-avatar">Q</div>
          </div>
          <div className="min-w-0">
            <p className="chat-who">Qazi&apos;s assistant</p>
            <p className="chat-sub mt-1">ask me anything about Qazi</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onClearHistory}
            disabled={messages.length === 0}
            className="p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/10 transition-all"
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
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-2">
            <span className="chat-greet-ic" aria-hidden="true">
              <Doodle name="chat" size={64} />
            </span>
            <p className="hi">Hi, I&apos;m Qazi&apos;s assistant.</p>
            <p className="chat-hint text-center -mt-2">tap a question below, or write your own</p>
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="chat-chip"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <>
            {messages.map((msg) =>
              msg.role === 'assistant' && msg.content === '' && isBusy
                ? null
                : <MessageBubble key={msg.id} message={msg} />
            )}
            {showTyping && <TypingIndicator />}
            {followUps.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                {followUps.map((s) => (
                  <button key={s} onClick={() => handleSuggestion(s)} className="chat-chip">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex items-end gap-2">
          <div className="chat-inputwrap flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Qazi…"
              disabled={isBusy}
              rows={1}
              className="w-full resize-none bg-transparent text-[13px] text-ink placeholder-ink-soft/40 focus:outline-none disabled:opacity-40 leading-relaxed"
              style={{ maxHeight: '100px', minHeight: '20px' }}
              aria-label="Message"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center shrink-0 hover:bg-coral-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 mb-0.5"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="chat-time text-center mt-2">
          enter to send · shift+enter for a new line
        </p>
      </div>
    </div>
  );
});
