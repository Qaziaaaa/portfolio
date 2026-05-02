import type { KnowledgeChunk } from '../types';
import { bioChunks } from './bio';
import { skillsChunks } from './skills';
import { experienceChunks } from './experience';
import { projectsChunks } from './projects';
import { contactChunks } from './contact';

/**
 * The complete knowledge base for the RAG chatbot.
 * All chunks are aggregated here in topic order.
 * Adding a new topic file only requires importing it and spreading it here —
 * the Initializer picks it up automatically on the next application load.
 */
export const ALL_CHUNKS: KnowledgeChunk[] = [
  ...bioChunks,
  ...skillsChunks,
  ...experienceChunks,
  ...projectsChunks,
  ...contactChunks,
];
