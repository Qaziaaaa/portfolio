import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChatbot } from './useChatbot';

const ChatPanel = lazy(() =>
  import('./ChatPanel').then((m) => ({ default: m.ChatPanel }))
);

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const { status, messages, isStreaming, sendMessage, clearHistory, initializeIfNeeded } =
    useChatbot();

  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      initializeIfNeeded();
    }
  }, [isOpen, hasOpenedOnce, initializeIfNeeded]);

  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

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
            // Mobile: bottom sheet, full width, sits above the toggle button area
            'bottom-0 left-0 right-0',
            // Desktop: floating panel above toggle button
            'sm:bottom-24 sm:right-6 sm:left-auto sm:w-[380px]',
          ].join(' ')}
        >
          <Suspense fallback={null}>
            <ChatPanel
              messages={messages}
              status={status}
              isStreaming={isStreaming}
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
          className={[
            'w-13 h-13 w-[52px] h-[52px] rounded-full flex items-center justify-center',
            'shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
            isOpen
              ? 'bg-[#1a1a1a] border border-white/15 text-white/70 hover:text-white hover:border-white/30'
              : 'bg-white text-black hover:scale-105 hover:shadow-[0_4px_32px_rgba(255,255,255,0.15)]',
          ].join(' ')}
          aria-label={isOpen ? 'Close chat' : "Chat with Qazi's assistant"}
          aria-expanded={isOpen}
        >
          {isOpen
            ? <X className="w-5 h-5" />
            : <MessageSquare className="w-5 h-5" />
          }
        </button>
      </div>
    </>
  );
}
