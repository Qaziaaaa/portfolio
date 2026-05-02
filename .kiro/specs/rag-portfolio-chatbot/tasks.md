# Implementation Plan: RAG Portfolio Chatbot

## Overview

Implement a fully client-side RAG chatbot widget for the portfolio site. The pipeline runs entirely in the browser: a static TypeScript knowledge base is batch-embedded via Jina AI on first panel open, queries are matched against stored vectors using cosine similarity, and responses are streamed from Groq's LLM API. The widget is lazy-loaded and integrated into `App.tsx` via `React.lazy` + `Suspense`.

## Tasks

- [x] 1. Project setup and environment configuration
  - Install Vitest, `@testing-library/react`, `@testing-library/user-event`, `fast-check`, and `jsdom` as dev dependencies
  - Add `vitest.config.ts` (or extend `vite.config.ts`) with jsdom environment and global test setup
  - Add `.env.example` with placeholder values for `VITE_JINA_API_KEY` and `VITE_GROQ_API_KEY`
  - Add `.env` and `.env.local` entries to `.gitignore`
  - Create the directory scaffolding: `src/lib/chatbot/knowledge/`, `src/components/chatbot/`
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 2. Define shared TypeScript types
  - [x] 2.1 Create `src/lib/chatbot/types.ts` with `KnowledgeChunk`, `VectorEntry`, `InitStatus`, and `ChatMessage` interfaces exactly as specified in the design
    - `InitStatus` union: `'idle' | 'loading' | 'ready' | 'error' | 'misconfigured'`
    - `ChatMessage.id` uses `crypto.randomUUID()`
    - _Requirements: 2.6_

- [x] 3. Author the knowledge base data files
  - [x] 3.1 Create `src/lib/chatbot/knowledge/bio.ts` with personal bio chunks (name, background, location, summary)
    - Each chunk text must be ≤ 2000 characters
    - Export `bioChunks: KnowledgeChunk[]`
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.2 Create `src/lib/chatbot/knowledge/skills.ts` with skills and technologies chunks
    - Cover frontend, backend, tools, and languages
    - Export `skillsChunks: KnowledgeChunk[]`
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.3 Create `src/lib/chatbot/knowledge/experience.ts` with one chunk per work role (all three roles)
    - Include company, title, dates, and key responsibilities per chunk
    - Export `experienceChunks: KnowledgeChunk[]`
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.4 Create `src/lib/chatbot/knowledge/projects.ts` with one chunk per project (all five projects with URLs)
    - Use the exact project data shown in the design document
    - Export `projectsChunks: KnowledgeChunk[]`
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.5 Create `src/lib/chatbot/knowledge/contact.ts` with contact information chunks (email and WhatsApp)
    - Export `contactChunks: KnowledgeChunk[]`
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 3.6 Create `src/lib/chatbot/knowledge/index.ts` that aggregates all topic arrays into `ALL_CHUNKS: KnowledgeChunk[]`
    - Spread all five topic arrays in order: bio, skills, experience, projects, contact
    - _Requirements: 1.1, 1.3_

  - [ ]* 3.7 Write property test for knowledge base chunk size invariant
    - **Property 1: Knowledge base chunk size invariant**
    - **Validates: Requirements 1.4**
    - For every chunk in `ALL_CHUNKS`, assert `chunk.text.length <= 2000`
    - Also assert all five topics are represented (unit test: Req 1.1)

- [x] 4. Implement the vector store
  - [x] 4.1 Create `src/lib/chatbot/vectorStore.ts` with module-level singleton `store: VectorEntry[]`
    - Implement `populateStore(entries: VectorEntry[]): void`
    - Implement `searchStore(queryEmbedding: number[], topK: number): Array<{ entry: VectorEntry; score: number }>` using cosine similarity, sorted descending
    - Implement `clearStore(): void` and `isPopulated(): boolean`
    - Cosine similarity formula: `(A · B) / (|A| × |B|)`
    - _Requirements: 2.6, 3.2, 3.5_

  - [ ]* 4.2 Write property test for cosine similarity bounds and self-similarity
    - **Property 4: Cosine similarity is bounded and self-similar**
    - **Validates: Requirements 3.2**
    - Use `fc.array(fc.float({ noNaN: true, noDefaultInfinity: true }), { minLength: 1 })` for vectors
    - Assert `cosineSimilarity(A, B)` is in `[-1, 1]` for any two non-zero vectors
    - Assert `cosineSimilarity(A, A) ≈ 1` within floating-point tolerance (`Math.abs(result - 1) < 1e-6`)

  - [ ]* 4.3 Write property test for retriever result ordering
    - **Property 5: Retriever returns top-K results in descending score order**
    - **Validates: Requirements 3.3**
    - Populate store with randomly generated entries, run `searchStore` with a random query embedding
    - Assert returned scores are in non-increasing order and count equals `topK`

- [x] 5. Implement the Jina AI embeddings client
  - [x] 5.1 Create `src/lib/chatbot/jinaClient.ts` with `embedTexts(texts: string[]): Promise<number[][]>`
    - POST to `https://api.jina.ai/v1/embeddings` with `model: "jina-embeddings-v3"`
    - Set `Authorization: Bearer ${import.meta.env.VITE_JINA_API_KEY}`
    - Throw a typed `EmbeddingError` on non-2xx responses
    - Return the array of embedding vectors from the response
    - _Requirements: 2.1, 2.2_

  - [ ]* 5.2 Write unit tests for Jina client
    - Mock `fetch` to return a 200 response with a valid embeddings payload; assert request body contains `model: "jina-embeddings-v3"` (Req 2.2)
    - Mock `fetch` to return a 500 response; assert `EmbeddingError` is thrown (Req 2.3)

- [x] 6. Implement the initializer
  - [x] 6.1 Create `src/lib/chatbot/initializer.ts` with `initialize(): Promise<void>`
    - Check `VITE_JINA_API_KEY` and `VITE_GROQ_API_KEY`; throw `MisconfiguredError` if either is missing or empty
    - Return immediately if `vectorStore.isPopulated()` (idempotent guard)
    - Extract all texts from `ALL_CHUNKS`, call `jinaClient.embedTexts(allTexts)` in a single batched request
    - Zip embeddings with chunks and call `vectorStore.populateStore(entries)`
    - _Requirements: 2.1, 2.3, 2.4, 6.5_

  - [ ]* 6.2 Write property test for initializer — one entry per chunk
    - **Property 2: Initializer embeds all chunks and populates the store**
    - **Validates: Requirements 1.3, 2.1, 2.6**
    - Mock `jinaClient.embedTexts` to return deterministic unit vectors
    - Use `fc.array(fc.record({ text: fc.string({ minLength: 1 }), metadata: fc.record({ topic: fc.string(), source: fc.string() }) }), { minLength: 1 })` for chunk arrays
    - Assert store contains exactly one entry per input chunk with matching text and metadata

  - [ ]* 6.3 Write property test for initializer — single batched API call
    - **Property 3: Initializer uses a single batched API call**
    - **Validates: Requirements 2.4**
    - Mock `jinaClient.embedTexts` and count invocations
    - For any non-empty chunk array, assert `embedTexts` was called exactly once

  - [ ]* 6.4 Write unit tests for initializer error paths
    - Missing `VITE_JINA_API_KEY` → `MisconfiguredError` thrown (Req 6.5)
    - Jina API 500 → `EmbeddingError` propagates (Req 2.3)
    - Second call when store is populated → `embedTexts` not called again (idempotent)

- [ ] 7. Checkpoint — Ensure all library unit and property tests pass
  - Run `npx vitest --run src/lib/chatbot` and confirm all tests pass
  - Ask the user if any questions arise before proceeding to the retriever and Groq client

- [x] 8. Implement the retriever
  - [x] 8.1 Create `src/lib/chatbot/retriever.ts` with `retrieve(query: string, topK?: number, threshold?: number): Promise<{ chunks: string[]; belowThreshold: boolean }>`
    - Default `topK = 3`, `threshold = 0.3`
    - Call `jinaClient.embedTexts([query])` to get the query embedding
    - Call `vectorStore.searchStore(queryEmbedding, topK)`
    - If top score < threshold, return `{ chunks: [], belowThreshold: true }`
    - Otherwise return top-K chunk texts
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 8.2 Write unit tests for retriever threshold behavior
    - All scores below 0.3 → returns `{ chunks: [], belowThreshold: true }` (Req 3.4)
    - Scores above threshold → returns correct chunk texts in order

- [x] 9. Implement the Groq streaming client
  - [x] 9.1 Create `src/lib/chatbot/groqClient.ts` with `streamCompletion(systemPrompt, history, userMessage, onToken, onDone, onError): Promise<void>`
    - POST to `https://api.groq.com/openai/v1/chat/completions` with `model: "llama3-8b-8192"`, `stream: true`, `max_tokens: 300`
    - Set `Authorization: Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    - Read the SSE `ReadableStream`, parse `data:` lines, call `onToken` for each `delta.content`, call `onDone` on `[DONE]`
    - Call `onError` on non-2xx response or stream error
    - Implement `buildSystemPrompt(chunks: string[]): string` that assembles the system prompt template with `---` delimiters
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 9.2 Write property test for system prompt chunk inclusion
    - **Property 6: System prompt contains all retrieved chunks with delimiters**
    - **Validates: Requirements 4.1, 4.3**
    - Use `fc.array(fc.string({ minLength: 1 }), { minLength: 1 })` for chunk arrays
    - Assert each chunk text appears in the assembled prompt and `---` delimiter is present between chunks
    - Assert prompt contains the instruction to answer only from context

  - [ ]* 9.3 Write property test for SSE token delivery order
    - **Property 7: Streaming delivers all tokens in order**
    - **Validates: Requirements 4.6**
    - Mock `fetch` to return a `ReadableStream` emitting a configurable sequence of SSE token events
    - Use `fc.array(fc.string({ minLength: 1 }), { minLength: 1 })` for token sequences
    - Assert `onToken` is called exactly once per token in the same order

  - [ ]* 9.4 Write property test for Groq history cap
    - **Property 8: Chat history sent to Groq is capped at 4 turns**
    - **Validates: Requirements 4.7**
    - Use `fc.array(fc.record({ role: fc.constantFrom('user', 'assistant'), content: fc.string() }), { minLength: 0 })` for history
    - Assert the `messages` array in the Groq request body contains at most 8 messages and they are the most recent

  - [ ]* 9.5 Write unit tests for Groq client
    - Request body contains `model: "llama3-8b-8192"` (Req 4.2)
    - Request body contains `max_tokens: 300` (Req 4.4)
    - Non-2xx response → `onError` called with error (Req 4.5)

- [x] 10. Implement the `useChatbot` state management hook
  - [x] 10.1 Create `src/components/chatbot/useChatbot.ts` with the `useChatbot()` hook
    - State: `{ status: InitStatus; messages: ChatMessage[]; isStreaming: boolean }`
    - `initializeIfNeeded()`: sets `status = 'loading'`, calls `initializer.initialize()`, sets `status = 'ready'` or `'error'`/`'misconfigured'` on failure
    - `sendMessage(text)`: appends user message, calls `retriever.retrieve()`, assembles system prompt, calls `groqClient.streamCompletion()`, updates assistant message incrementally via `onToken`
    - `clearHistory()`: resets `messages` to `[]`
    - Cap stored history at 40 messages (20 pairs); drop oldest pair when limit is reached
    - Send only the last 8 messages (4 turns) to Groq as chat history
    - _Requirements: 4.7, 7.1, 7.2, 7.3, 7.5_

  - [ ]* 10.2 Write property test for conversation history cap
    - **Property 11: Conversation history is capped at 20 message pairs**
    - **Validates: Requirements 7.5**
    - Use `fc.array(fc.string({ minLength: 1 }), { minLength: 21 })` to generate more than 20 user messages
    - Simulate `sendMessage` calls and assert `messages.length <= 40` at all times
    - Assert the most recently added messages are always retained

  - [ ]* 10.3 Write unit tests for `useChatbot`
    - Messages persist in state across re-renders (Req 7.1)
    - `clearHistory()` resets messages to `[]` (Req 7.3)
    - `initializeIfNeeded()` not called until panel is first opened (Req 8.2)

- [x] 11. Build the UI components
  - [x] 11.1 Create `src/components/chatbot/TypingIndicator.tsx`
    - Three dots with staggered `animate-bounce`
    - When `prefers-reduced-motion: reduce` is active, omit animation classes (use `window.matchMedia` or a CSS media query)
    - _Requirements: 5.6, 8.4_

  - [x] 11.2 Create `src/components/chatbot/MessageBubble.tsx`
    - User messages: right-aligned, `bg-white text-black` pill
    - Assistant messages: left-aligned, `bg-white/5 text-white` pill with `border border-white/10`
    - Render timestamp as relative time (e.g., "just now")
    - _Requirements: 5.5_

  - [x] 11.3 Create `src/components/chatbot/ChatPanel.tsx`
    - Header: "Ask about Qazi" title + close button + clear chat button
    - Scrollable message history area with `ref` for auto-scroll; scroll to bottom on every new message
    - Empty state: suggested prompt "Ask me about Qazi's skills or projects" when `messages.length === 0`
    - Render `<TypingIndicator>` while `isStreaming && messages[last].content === ''`
    - Text input + send button; both disabled while `isStreaming || status === 'loading'`
    - Full keyboard accessibility: `Enter` submits, `Escape` closes panel, focus management on open
    - _Requirements: 5.2, 5.6, 5.7, 5.9, 5.10, 7.3, 7.4_

  - [x] 11.4 Create `src/components/chatbot/ChatbotWidget.tsx` as the lazy-loaded root entry point
    - Floating toggle button fixed at `bottom-6 right-6`, `z-50`
    - Manages open/closed state; renders `<ChatPanel>` when open
    - Calls `useChatbot().initializeIfNeeded()` when panel is first opened
    - Renders loading indicator overlay when `status === 'loading'`
    - Renders configuration error message when `status === 'misconfigured'`
    - Renders temporary unavailability message when `status === 'error'`
    - Uses Tailwind dark theme: `bg-[#010101]`, `border-white/10`, `text-white`
    - Responsive: usable from 320px to 2560px viewport width
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7, 5.8, 6.5_

  - [ ]* 11.5 Write property test for chat panel toggle round-trip
    - **Property 9: Chat panel toggle is a round-trip**
    - **Validates: Requirements 5.3**
    - Use React Testing Library to render `<ChatbotWidget>`
    - Use `fc.boolean()` as initial state; click toggle and assert state flips

  - [ ]* 11.6 Write property test for message bubble alignment
    - **Property 10: Message bubble alignment matches role**
    - **Validates: Requirements 5.5**
    - Use `fc.record({ id: fc.uuid(), role: fc.constantFrom('user', 'assistant'), content: fc.string(), timestamp: fc.integer() })` for messages
    - Assert user messages have right-alignment class, assistant messages have left-alignment class

  - [ ]* 11.7 Write property test for close/reopen history preservation
    - **Property 12: Close and reopen preserves conversation history**
    - **Validates: Requirements 7.2**
    - Render `<ChatbotWidget>` with pre-populated messages, close panel, reopen, assert same messages displayed in same order

  - [ ]* 11.8 Write unit tests for UI components
    - Clicking toggle button opens chat panel (Req 5.2)
    - `isStreaming=true` + empty last message → `<TypingIndicator>` visible (Req 5.6)
    - After message added, scroll position is at bottom (Req 5.9)
    - Empty history → suggested prompt visible (Req 5.10)
    - `status='loading'` → loading indicator visible, input disabled (Req 2.5)
    - Missing API key → configuration message visible (Req 6.5)
    - `prefers-reduced-motion: reduce` → animation classes absent on `<TypingIndicator>` (Req 8.4)

- [ ] 12. Checkpoint — Ensure all component tests pass
  - Run `npx vitest --run src/components/chatbot` and confirm all tests pass
  - Ask the user if any questions arise before wiring everything together

- [x] 13. Wire the widget into `App.tsx`
  - [x] 13.1 Add `React.lazy` import for `ChatbotWidget` in `src/App.tsx`
    - `const ChatbotWidget = React.lazy(() => import('./components/chatbot/ChatbotWidget'))`
    - Wrap with `<Suspense fallback={null}>` inside the root `<div>`, after `<Footer />`
    - Add `import React, { Suspense } from 'react'` (or update existing React import)
    - _Requirements: 8.1, 8.2_

- [x] 14. Final checkpoint — Full test suite and build verification
  - Run `npx vitest --run` and confirm all tests pass
  - Run `npm run build` and confirm the TypeScript build succeeds with no errors
  - Verify the chatbot bundle is in a separate chunk (not in the main bundle) by inspecting Vite build output
  - Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 7, 12, and 14 ensure incremental validation
- Property tests validate universal correctness invariants; unit tests cover specific examples and error conditions
- The design uses TypeScript throughout — no language selection needed
- Knowledge base files should be authored with real portfolio data from `info.md` or the existing section components
