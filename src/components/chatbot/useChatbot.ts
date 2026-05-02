import { useState, useCallback, useRef } from 'react';
import { initialize, MisconfiguredError } from '../../lib/chatbot/initializer';
import { retrieve } from '../../lib/chatbot/retriever';
import { buildSystemPrompt, streamCompletion } from '../../lib/chatbot/groqClient';
import type { ChatMessage, InitStatus } from '../../lib/chatbot/types';
import type { HistoryMessage } from '../../lib/chatbot/groqClient';

const MAX_MESSAGES = 40;

export function useChatbot() {
  const [status, setStatus] = useState<InitStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const initAttempted = useRef(false);
  // Keep a ref to messages so sendMessage doesn't need it as a dependency
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const initializeIfNeeded = useCallback(async () => {
    if (initAttempted.current) return;
    initAttempted.current = true;
    setStatus('loading');
    try {
      await initialize();
      setStatus('ready');
    } catch (err) {
      if (err instanceof MisconfiguredError) {
        console.error('[Chatbot] Misconfigured:', err.message);
        setStatus('misconfigured');
      } else {
        console.error('[Chatbot] Init error:', err);
        setStatus('error');
      }
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg, assistantMsg];
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
    });
    setIsStreaming(true);

    try {
      const { chunks } = await retrieve(trimmed);
      const systemPrompt = buildSystemPrompt(chunks);

      // Build history from ref (avoids stale closure)
      const history: HistoryMessage[] = messagesRef.current
        .filter((m) => m.content.trim() !== '')
        .map((m) => ({ role: m.role, content: m.content }));

      await streamCompletion(
        systemPrompt,
        history,
        trimmed,
        (token) => {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: m.content + token } : m)
          );
        },
        () => { setIsStreaming(false); },
        (err) => {
          console.error('[Chatbot] Stream error:', err.message);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "Sorry, I'm having trouble connecting. Please try again." }
                : m
            )
          );
          setIsStreaming(false);
        }
      );
    } catch (err) {
      console.error('[Chatbot] sendMessage error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I'm having trouble connecting. Please try again." }
            : m
        )
      );
      setIsStreaming(false);
    }
  // No messages dependency — using ref instead
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHistory = useCallback(() => setMessages([]), []);

  return { status, messages, isStreaming, sendMessage, clearHistory, initializeIfNeeded };
}
