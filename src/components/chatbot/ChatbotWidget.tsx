import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChatbot } from './useChatbot';

// Lazy-load the heavy ChatPanel to keep initial bundle small
const ChatPanel = lazy(() =>
  import('./ChatPanel').then((m) => ({ default: m.ChatPanel }))
);

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const { status, messages, isStreaming, sendMessage, clearHistory, initializeIfNeeded } =
    useChatbot();

  // Initialize on first open only
  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      initializeIfNeeded();
    }
  }, [isOpen, hasOpenedOnce, initializeIfNeeded]);

  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="fixed z-50
            /* Mobile: full-width bottom sheet */
            bottom-0 left-0 right-0
            /* Desktop: floating above toggle button */
            sm:bottom-[5.5rem] sm:left-auto sm:right-6 sm:w-auto"
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
        </>
      )}

      {/* Floating toggle button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={handleToggle}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
            isOpen
              ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
              : 'bg-white text-black hover:scale-105 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]'
          }`}
          aria-label={isOpen ? 'Close assistant' : "Chat with Qazi's assistant"}
          aria-expanded={isOpen}
        >
          {isOpen
            ? <X className="w-4 h-4 sm:w-5 sm:h-5" />
            : <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          }
        </button>
      </div>
    </>
  );
}
