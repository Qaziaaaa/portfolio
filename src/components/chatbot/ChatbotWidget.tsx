import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { useChatbot } from './useChatbot';

/**
 * ChatbotWidget — the lazy-loaded root entry point for the RAG chatbot.
 *
 * Renders a fixed floating toggle button in the bottom-right corner.
 * When opened, renders the ChatPanel and triggers initialization on first open.
 *
 * This component is the default export so it can be used with React.lazy:
 *   const ChatbotWidget = React.lazy(() => import('./components/chatbot/ChatbotWidget'));
 */
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const { status, messages, isStreaming, sendMessage, clearHistory, initializeIfNeeded } =
    useChatbot();

  // Initialize on first open
  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      initializeIfNeeded();
    }
  }, [isOpen, hasOpenedOnce, initializeIfNeeded]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleClearHistory = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  // Close on Escape key when panel is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <ChatPanel
          messages={messages}
          status={status}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onClearHistory={handleClearHistory}
          onClose={handleClose}
          inputValue={inputValue}
          onInputChange={setInputValue}
        />
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          isOpen
            ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            : 'bg-white text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat with Qazi\'s assistant'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
