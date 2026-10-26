import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChatbot } from './useChatbot';

const ChatPanel = lazy(() =>
  import('./ChatPanel').then((m) => ({ default: m.ChatPanel }))
);

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { messages, isBusy, sendMessage, clearHistory, warm } = useChatbot();

  // Warm the agent in the background (server cold start) during browser idle.
  useEffect(() => {
    const warmCall = () => warm();
    const hasIdleCallback = typeof window !== 'undefined' && 'requestIdleCallback' in window;
    const id = hasIdleCallback
      ? (window as unknown as {
          requestIdleCallback(cb: () => void, opts?: { timeout: number }): number;
        }).requestIdleCallback(warmCall, { timeout: 2500 })
      : window.setTimeout(warmCall, 1200);

    return () => {
      if (hasIdleCallback) {
        (window as unknown as { cancelIdleCallback?(id: number): void }).cancelIdleCallback?.(id);
      } else {
        window.clearTimeout(id);
      }
    };
  }, [warm]);

  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  // Hovering the toggle also warms the agent (idempotent).
  const handleWarmHover = useCallback(() => warm(), [warm]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm sm:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={[
            'fixed z-[999]',
            // Mobile: sits above the toggle button (toggle is bottom-5, h-[52px] = ~3.25rem, plus gap)
            'bottom-[4.5rem] left-0 right-0',
            // Desktop: floating panel above toggle button
            'sm:bottom-20 sm:right-5 sm:left-auto sm:w-[360px]',
          ].join(' ')}
        >
          <Suspense fallback={null}>
            <ChatPanel
              messages={messages}
              isBusy={isBusy}
              onSendMessage={sendMessage}
              onClearHistory={clearHistory}
              onClose={handleClose}
              inputValue={inputValue}
              onInputChange={setInputValue}
            />
          </Suspense>
        </div>
      )}

      {/* Toggle button — always visible, never overlaps panel */}
      <div className="fixed bottom-5 right-5 z-[1000]">
        <button
          onClick={handleToggle}
          onMouseEnter={handleWarmHover}
          onFocus={handleWarmHover}
          className={`chat-toggle${isOpen ? ' is-open' : ''}`}
          aria-label={isOpen ? 'Close chat' : "Chat with Qazi's assistant"}
          aria-expanded={isOpen}
        >
          <span className="chat-tape-strip" aria-hidden="true" />
          {isOpen
            ? <X className="w-5 h-5" />
            : <MessageSquare className="w-5 h-5" />
          }
        </button>
      </div>
    </>
  );
}
