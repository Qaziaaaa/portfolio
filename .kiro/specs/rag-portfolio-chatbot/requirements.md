# Requirements Document

## Introduction

This feature adds a RAG (Retrieval-Augmented Generation) chatbot to Qazi Farhan Ahmad's portfolio website. The chatbot floats as a persistent widget on the site and answers visitor questions about Qazi's skills, experience, projects, and contact information. It uses Jina AI to embed a static knowledge base of portfolio data at build time, stores vectors in an in-memory store on the client side, retrieves the most relevant chunks at query time, and sends them as context to the Groq LLM API to generate a grounded, accurate response. The entire feature is implemented within the existing React/Vite/TypeScript/Tailwind CSS/shadcn-ui stack with no new backend server required.

---

## Glossary

- **Chatbot_Widget**: The floating chat UI component rendered on every page of the portfolio site.
- **Knowledge_Base**: A static, curated set of text documents describing Qazi's bio, skills, experience, projects, and contact details.
- **Chunk**: A discrete, semantically meaningful segment of text split from a Knowledge_Base document.
- **Embedding**: A fixed-length numerical vector representation of a Chunk produced by the Jina AI Embeddings API.
- **Vector_Store**: An in-memory data structure that holds all Chunk–Embedding pairs and supports cosine-similarity search.
- **Retriever**: The module that converts a user query into an embedding and returns the top-K most similar Chunks from the Vector_Store.
- **Groq_Client**: The module that calls the Groq Chat Completions API with a system prompt, retrieved context, and the user's message.
- **RAG_Pipeline**: The end-to-end flow: user query → Retriever → context assembly → Groq_Client → response.
- **Initializer**: The module that runs once on application load to embed all Chunks and populate the Vector_Store.
- **API_Key**: A secret string required to authenticate with Jina AI or Groq; stored in a Vite `.env` file and never committed to source control.

---

## Requirements

### Requirement 1: Knowledge Base Definition

**User Story:** As the portfolio owner, I want all my personal and professional information stored in a structured knowledge base, so that the chatbot can answer questions accurately about me.

#### Acceptance Criteria

1. THE Knowledge_Base SHALL contain at minimum the following topic areas: personal bio, skills and technologies, work experience (all three roles), projects (all five listed projects with URLs), and contact information (email and WhatsApp).
2. THE Knowledge_Base SHALL be authored as static TypeScript/JSON data files co-located in `src/lib/chatbot/knowledge/`.
3. WHEN the Knowledge_Base data is updated, THE Initializer SHALL re-embed all Chunks on the next application load without requiring any other code change.
4. THE Knowledge_Base SHALL represent each topic area as one or more Chunks of no more than 500 tokens each to stay within embedding model input limits.

---

### Requirement 2: Embedding Generation and Vector Store Initialization

**User Story:** As a developer, I want all knowledge base chunks embedded and indexed in memory when the app loads, so that retrieval is fast and requires no external database.

#### Acceptance Criteria

1. WHEN the application first loads, THE Initializer SHALL call the Jina AI Embeddings API (`https://api.jina.ai/v1/embeddings`) with all Chunks and store the resulting Embedding vectors in the Vector_Store.
2. THE Initializer SHALL use the Jina AI model `jina-embeddings-v3` (or the latest free-tier equivalent) for all embedding calls.
3. WHEN the Jina AI API returns an error during initialization, THE Initializer SHALL log the error to the browser console and set the Chatbot_Widget to a degraded state that informs the user that the assistant is temporarily unavailable.
4. THE Initializer SHALL complete embedding of all Chunks in a single batched API request to minimize latency and API call count.
5. WHILE the Initializer is running, THE Chatbot_Widget SHALL display a loading indicator and disable the message input field.
6. THE Vector_Store SHALL store each entry as a tuple of `{ chunk: string; metadata: Record<string, string>; embedding: number[] }`.

---

### Requirement 3: Semantic Retrieval

**User Story:** As a visitor, I want the chatbot to find the most relevant information about Qazi before answering my question, so that responses are accurate and grounded in real data.

#### Acceptance Criteria

1. WHEN a user submits a query, THE Retriever SHALL call the Jina AI Embeddings API to produce an embedding for the query text.
2. THE Retriever SHALL compute cosine similarity between the query embedding and every Chunk embedding in the Vector_Store.
3. THE Retriever SHALL return the top 3 Chunks ranked by descending cosine similarity score.
4. IF the highest cosine similarity score is below 0.3, THEN THE Retriever SHALL return an empty context array and THE Groq_Client SHALL respond with a fallback message indicating the question is outside the scope of the portfolio.
5. THE Retriever SHALL complete the similarity search within 100 milliseconds for a Vector_Store containing up to 100 Chunks, measured on a modern browser.

---

### Requirement 4: LLM Response Generation via Groq

**User Story:** As a visitor, I want the chatbot to give me a natural, conversational answer about Qazi, so that I can quickly learn what I need to know.

#### Acceptance Criteria

1. WHEN the Retriever returns context Chunks, THE Groq_Client SHALL assemble a system prompt that instructs the LLM to answer only based on the provided context and to represent Qazi professionally.
2. THE Groq_Client SHALL call the Groq Chat Completions API (`https://api.groq.com/openai/v1/chat/completions`) using the model `llama3-8b-8192` (or the latest free-tier equivalent).
3. THE Groq_Client SHALL include the top retrieved Chunks as a `context` block in the system prompt, clearly delimited from the user message.
4. THE Groq_Client SHALL limit the response to a maximum of 300 tokens to keep answers concise.
5. IF the Groq API returns an HTTP error, THEN THE Groq_Client SHALL display a user-facing error message: "Sorry, I'm having trouble connecting right now. Please try again shortly."
6. THE Groq_Client SHALL stream the response token-by-token to the Chatbot_Widget to provide a real-time typing effect.
7. THE Groq_Client SHALL include the last 4 conversation turns (user + assistant messages) as chat history to support follow-up questions.

---

### Requirement 5: Chat Widget UI

**User Story:** As a visitor, I want a clean, unobtrusive chat widget that matches the portfolio's dark aesthetic, so that I can ask questions without disrupting my browsing experience.

#### Acceptance Criteria

1. THE Chatbot_Widget SHALL render as a fixed floating button in the bottom-right corner of the viewport at all times.
2. WHEN the floating button is clicked, THE Chatbot_Widget SHALL expand into a chat panel with a message history area and a text input field.
3. WHEN the chat panel is open and the floating button is clicked again, THE Chatbot_Widget SHALL collapse the chat panel.
4. THE Chatbot_Widget SHALL use the existing Tailwind CSS dark theme (`bg-[#010101]`, `border-white/10`, `text-white`) and shadcn/ui component primitives to match the portfolio's visual style.
5. THE Chatbot_Widget SHALL display each message in a distinct bubble: user messages right-aligned with a white background and black text, assistant messages left-aligned with a `bg-white/5` background and white text.
6. WHILE the Groq_Client is streaming a response, THE Chatbot_Widget SHALL display an animated typing indicator (three pulsing dots) until the first token arrives, then render tokens progressively.
7. THE Chatbot_Widget SHALL be fully keyboard-accessible: the user SHALL be able to open/close the widget, type a message, and submit it using only the keyboard.
8. THE Chatbot_Widget SHALL be responsive and usable on viewport widths from 320px to 2560px.
9. WHEN a new message is added to the message history, THE Chatbot_Widget SHALL automatically scroll the message area to the latest message.
10. THE Chatbot_Widget SHALL display a suggested opening prompt (e.g., "Ask me about Qazi's skills or projects") when the chat panel is first opened and the message history is empty.

---

### Requirement 6: API Key Security

**User Story:** As the portfolio owner, I want my API keys kept out of the source code, so that they are not exposed in the public repository.

#### Acceptance Criteria

1. THE Chatbot_Widget SHALL read the Jina AI API key exclusively from the Vite environment variable `VITE_JINA_API_KEY`.
2. THE Chatbot_Widget SHALL read the Groq API key exclusively from the Vite environment variable `VITE_GROQ_API_KEY`.
3. THE Knowledge_Base data files SHALL contain no API keys or secrets.
4. THE `.gitignore` file SHALL include `.env` and `.env.local` to prevent accidental key commits.
5. IF either `VITE_JINA_API_KEY` or `VITE_GROQ_API_KEY` is undefined at runtime, THEN THE Initializer SHALL log a descriptive error to the console and THE Chatbot_Widget SHALL display a message: "Chatbot is not configured. Please set the required environment variables."

---

### Requirement 7: Conversation State Management

**User Story:** As a visitor, I want my conversation history preserved while I browse the page, so that I can refer back to earlier answers without losing context.

#### Acceptance Criteria

1. THE Chatbot_Widget SHALL maintain conversation history in React component state for the duration of the browser session.
2. WHEN the chat panel is closed and reopened, THE Chatbot_Widget SHALL restore and display the full conversation history from the current session.
3. THE Chatbot_Widget SHALL provide a "Clear chat" button that resets the conversation history to an empty state.
4. WHEN the "Clear chat" button is activated, THE Chatbot_Widget SHALL display the suggested opening prompt again.
5. THE Chatbot_Widget SHALL limit stored conversation history to the last 20 message pairs to prevent unbounded memory growth.

---

### Requirement 8: Performance and Bundle Impact

**User Story:** As the portfolio owner, I want the chatbot feature to have minimal impact on initial page load performance, so that the site's Core Web Vitals scores are not degraded.

#### Acceptance Criteria

1. THE Chatbot_Widget component SHALL be loaded via React lazy loading (`React.lazy` + `Suspense`) so that its JavaScript bundle is not included in the initial page load.
2. THE Initializer SHALL only run after the Chatbot_Widget panel is opened for the first time, not on application startup.
3. THE Knowledge_Base data files SHALL have a combined uncompressed size of no more than 50 KB.
4. WHERE the user's browser supports the `prefers-reduced-motion` media query with a value of `reduce`, THE Chatbot_Widget SHALL disable all CSS transitions and animations.
