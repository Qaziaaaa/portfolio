import { useEffect, useRef, type KeyboardEvent } from 'react';
import { X, Trash2, Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, InitStatus } from '../../lib/chatbot/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  status: InitStatus;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

const SUGGESTED_PROMPT = "Ask me about Qazi's skills or projects";

/**
 * The expanded chat panel rendered when the widget is open.
 * Handles message display, input, auto-scroll, and keyboard accessibility.
 */
export function ChatPanel({
  messages,
  status,
  isStreaming,
  onSendMessage,
  onClearHistory,
  onClose,
  inputValue,
  onInputChange,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (status === 'ready') {
      inputRef.current?.focus();
    }
  }, [status]);

  const isDisabled = isStreaming || status === 'loading' || status !== 'ready';

  const handleSubmit = () => {
    if (!inputValue.trim() || isDisabled) return;
    onSendMessage(inputValue);
    onInputChange('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Determine if the last assistant message is still empty (streaming just started)
  const lastMessage = messages[messages.length - 1];
  const showTypingIndicator =
    isStreaming && lastMessage?.role === 'assistant' && lastMessage.content === '';

  return (
    <div
      className="flex flex-col bg-[#010101] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      style={{ width: 'min(380px, calc(100vw - 2rem))', height: 'min(520px, calc(100vh - 8rem))' }}
      role="dialog"
      aria-label="Chat with Qazi's assistant"
      aria-modal="false"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-white">Ask about Qazi</span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {/* Status states */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm text-white/50">Initializing assistant…</p>
          </div>
        )}

        {status === 'misconfigured' && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-white/50 text-center px-4">
              Chatbot is not configured. Please set the required environment variables.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-white/50 text-center px-4">
              The assistant is temporarily unavailable. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state — suggested prompt */}
        {status === 'ready' && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-1">Hi! I'm Qazi's assistant.</p>
              <p className="text-xs text-white/40">{SUGGESTED_PROMPT}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {status === 'ready' && messages.length > 0 && (
          <>
            {messages.map((msg) =>
              // Skip empty assistant placeholder while typing indicator is shown
              msg.role === 'assistant' && msg.content === '' && isStreaming ? null : (
                <MessageBubble key={msg.id} message={msg} />
              )
            )}
            {showTypingIndicator && <TypingIndicator />}
          </>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input area */}
      {(status === 'ready' || status === 'loading') && (
        <div className="px-4 py-3 border-t border-white/10 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              disabled={isDisabled}
              rows={1}
              className="flex-1 resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors max-h-32 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
              aria-label="Type your message"
            />
            <button
              onClick={handleSubmit}
              disabled={isDisabled || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-white/20 mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
