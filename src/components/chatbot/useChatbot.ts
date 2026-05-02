import { useState, useCallback, useRef } from 'react';
import { initialize, MisconfiguredError } from '../../lib/chatbot/initializer';
import { retrieve } from '../../lib/chatbot/retriever';
import { buildSystemPrompt, streamCompletion } from '../../lib/chatbot/groqClient';
import type { ChatMessage, InitStatus } from '../../lib/chatbot/types';
import type { HistoryMessage } from '../../lib/chatbot/groqClient';

/** Maximum number of messages stored in history (20 user + 20 assistant = 40). */
const MAX_MESSAGES = 40;

export function useChatbot() {
  const [status, setStatus] = useState<InitStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Track whether initialization has been attempted to avoid duplicate calls
  const initAttempted = useRef(false);

  /**
   * Initialize the RAG pipeline if not already done.
   * Should be called when the chat panel is first opened.
   */
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
        console.error('[Chatbot] Initialization error:', err);
        setStatus('error');
      }
    }
  }, []);

  /**
   * Send a user message through the RAG pipeline and stream the assistant response.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming || status !== 'ready') return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      // Append user message and cap history
      setMessages((prev) => {
        const updated = [...prev, userMessage];
        return updated.length > MAX_MESSAGES
          ? updated.slice(updated.length - MAX_MESSAGES)
          : updated;
      });

      // Create a placeholder assistant message for streaming
      const assistantId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        return updated.length > MAX_MESSAGES
          ? updated.slice(updated.length - MAX_MESSAGES)
          : updated;
      });

      setIsStreaming(true);

      try {
        // Retrieve relevant context
        const { chunks, belowThreshold } = await retrieve(text.trim());

        // Build system prompt
        const systemPrompt = buildSystemPrompt(chunks);

        // Build history for Groq (exclude the current user message and empty assistant placeholder)
        const history: HistoryMessage[] = messages
          .filter((m) => m.content.trim() !== '')
          .map((m) => ({ role: m.role, content: m.content }));

        if (belowThreshold) {
          // Still call Groq but with empty context — it will respond politely
        }

        await streamCompletion(
          systemPrompt,
          history,
          text.trim(),
          // onToken: append each token to the assistant message
          (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            );
          },
          // onDone
          () => {
            setIsStreaming(false);
          },
          // onError
          (err) => {
            console.error('[Chatbot] Groq streaming error — full message:', err.message);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content:
                        "Sorry, I'm having trouble connecting right now. Please try again shortly.",
                    }
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
              ? {
                  ...m,
                  content:
                    "Sorry, I'm having trouble connecting right now. Please try again shortly.",
                }
              : m
          )
        );
        setIsStreaming(false);
      }
    },
    [isStreaming, status, messages]
  );

  /** Reset the conversation history to an empty state. */
  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    status,
    messages,
    isStreaming,
    sendMessage,
    clearHistory,
    initializeIfNeeded,
  };
}
