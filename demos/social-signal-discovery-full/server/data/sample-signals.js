/*
 * FICTIONAL SAMPLE DATA for the full Social Signal Discovery demo.
 *
 * Every record was written for this demo. None is, or was copied from, a real public post.
 * Platform names show where such a discussion could appear (the approved scope only). URLs are
 * placeholders on example.com (reserved for documentation, RFC 2606). No author names are stored,
 * so no real or invented person appears.
 *
 * Deliberate duplicates, for duplicate detection:
 *   S-009 has the same URL as S-001 once normalized (case, query string, fragment, trailing slash).
 *   S-019 is the same platform and title as S-005, re-shared under a different URL.
 */
'use strict';

const r = (id, platform, post_date, topic, title, excerpt, url) =>
  Object.freeze({ id, platform, post_date, topic, title, excerpt, url: url || `https://example.com/sample/${id}`, is_sample: 1 });

const SAMPLE_SIGNALS = Object.freeze([
  r('S-001', 'Reddit', '2026-11-02', 'ai-training', 'Looking for an AI upskilling program for our analytics team',
    'Our company plans to train a 20-person data team on generative AI next quarter. Has anyone run a vendor evaluation for enterprise AI training? Budget is approved.'),
  r('S-002', 'Hacker News', '2026-11-04', 'ai-governance', 'How are you governing LLM use across departments?',
    'We are a mid-size insurer drafting an AI governance policy and need a partner to help our leadership team set guardrails.'),
  r('S-003', 'Dev.to', '2026-10-28', 'llm', 'Fine-tuning a small model on my laptop',
    'A weekend experiment fine-tuning an open model for personal note search.'),
  r('S-004', 'Hashnode', '2026-10-30', 'rag', 'What I learned building a RAG chatbot',
    'Notes from a hobby project: chunk sizes, embeddings and how I evaluated the answers.'),
  r('S-005', 'Discourse', '2026-11-06', 'ai-leadership', 'Recommendations for AI leadership training for directors?',
    'Our department heads need practical AI strategy training. Looking for recommendations on programs that cover adoption roadmaps.'),
  r('S-006', 'Bluesky', '2026-11-01', 'cooking', 'Best sourdough starter tips',
    'Feeding schedule questions for a new starter.'),
  r('S-007', 'YouTube', '2026-10-25', 'llm', 'Explaining transformers in 10 minutes',
    'A beginner-friendly video on how attention works in large language models.'),
  r('S-008', 'Product Hunt', '2026-11-03', 'ai-tools', 'Launch: an AI meeting-notes app',
    'Product launch post for a note-taking tool with AI summaries.'),
  r('S-009', 'Reddit', '2026-11-02', 'ai-training', 'Looking for an AI upskilling program for our analytics team',
    'Shared copy of the same discussion, reached through a tracking link.',
    'HTTPS://Example.com/sample/S-001/?utm_source=share#top'),
  r('S-010', 'Hacker News', '2026-10-29', 'outdoors', 'Weekend hiking trails near Austin',
    'Looking for moderate trails with shade for a family trip.'),
  r('S-011', 'Discourse', '2026-11-07', 'ai-adoption', 'Our team wants to adopt Claude for internal workflows: where to start?',
    'We are an operations team at a logistics company evaluating AI tools and looking for a training partner to onboard staff.'),
  r('S-012', 'Reddit', '2026-11-05', 'ai-careers', 'Is it worth learning AI as a career switcher?',
    'I work in retail and wonder whether self-study in machine learning is enough to change careers.'),
  r('S-013', 'Hashnode', '2026-11-08', 'ai-training', 'Evaluating AI training vendors for our engineering org',
    'Our engineering org has budget for an AI training program next year. We are comparing vendors and want recommendations.'),
  r('S-014', 'Bluesky', '2026-11-09', 'ai-literacy', 'School district looking for AI literacy training for staff',
    'Our district leadership wants AI literacy training for teachers and staff this spring. Looking for a partner with education experience.'),
  r('S-015', 'Reddit', '2026-10-27', 'llm', 'Which LLM benchmark actually matters?',
    'Curious which model benchmarks people trust when comparing chatbots.'),
  r('S-016', 'YouTube', '2026-11-04', 'ai-agents', 'AI agents explained for beginners',
    'An introductory video on what AI agents are and how they use tools.'),
  r('S-017', 'Product Hunt', '2026-11-06', 'productivity', 'Launch: a simple habit tracker',
    'A minimal habit tracking app for daily routines.'),
  r('S-018', 'Dev.to', '2026-10-31', 'css', 'CSS grid tips for responsive layouts',
    'Practical patterns for grid areas and media queries.'),
  r('S-019', 'Discourse', '2026-11-06', 'ai-leadership', 'Recommendations for AI leadership training for directors?',
    'Re-shared copy of the same thread in a second category.',
    'https://example.com/sample/S-005-repost'),
  r('S-020', 'Hacker News', '2026-11-10', 'ai-governance', 'Building an internal AI policy for a hospital network',
    'Our hospital network leadership is drafting AI usage rules and needs a partner to train department managers.'),
]);

module.exports = { SAMPLE_SIGNALS };
