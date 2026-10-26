import { useState, useCallback, useRef, useEffect } from 'react';
import {
  askAgent,
  blocksToPlainText,
  pingAgent,
  AgentError,
  type HistoryTurn,
} from '../../lib/chatbot/agentClient';
import type { ChatMessage } from '../../lib/chatbot/types';

const MAX_MESSAGES = 40;

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const busyRef = useRef(false);
  // Keep a ref to messages so sendMessage doesn't need it as a dependency
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;
    busyRef.current = true;

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

    // History from ref (avoids stale closure) — plain text of prior turns
    const history: HistoryTurn[] = messagesRef.current
      .filter((m) => m.content.trim() !== '')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => {
      const next = [...prev, userMsg, assistantMsg];
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
    });
    setIsBusy(true);

    try {
      const response = await askAgent(trimmed, history);
      const content = blocksToPlainText(response.blocks);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content,
                blocks: response.blocks,
                suggestions: response.suggestions,
                sources: response.sources,
                trace: response.trace,
              }
            : m
        )
      );
    } catch (err) {
      console.error('[Chatbot] agent error:', err);
      const status = err instanceof AgentError ? err.status : undefined;
      const content =
        status === 429
          ? "Hit Groq's rate limit — wait about 30 seconds, then send that again."
          : "Sorry, the agent hit a snag — please try again in a moment.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content,
              }
            : m
        )
      );
    } finally {
      busyRef.current = false;
      setIsBusy(false);
    }
  }, []);

  const clearHistory = useCallback(() => setMessages([]), []);

  return { messages, isBusy, sendMessage, clearHistory, warm: pingAgent };
}
