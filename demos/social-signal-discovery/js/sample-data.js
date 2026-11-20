/*
 * SAMPLE DATA for the Social Signal Discovery demo.
 *
 * Every record below is FICTIONAL. Each was written for this demo to exercise the pipeline; none
 * is, or was copied from, a real public post. Platform names show where such a discussion could
 * appear. URLs are placeholders on example.com (reserved for documentation, RFC 2606). No author
 * names are included, so no real or invented person appears.
 *
 * Two records are deliberate duplicates, to exercise duplicate detection:
 *   SAMPLE-009 has the same URL as SAMPLE-001 once normalized (case, query string, fragment, slash).
 *   The second SAMPLE-002 repeats an existing record id.
 */
window.SSD = window.SSD || {};

SSD.SAMPLE_NOTICE = 'Sample record: fictional, written for this demo. Not a real public post.';

SSD.SAMPLE_RECORDS = Object.freeze([
  { id: 'SAMPLE-001', platform: 'Reddit', date: '2026-11-02', topic: 'ai-training',
    title: 'Looking for an AI upskilling program for our analytics team',
    excerpt: 'Our company plans to train a 20-person data team on generative AI next quarter. Has anyone run a vendor evaluation for enterprise AI training? Budget is approved.',
    url: 'https://example.com/sample/SAMPLE-001' },
  { id: 'SAMPLE-002', platform: 'Hacker News', date: '2026-11-04', topic: 'ai-governance',
    title: 'How are you governing LLM use across departments?',
    excerpt: 'We are a mid-size insurer drafting an AI governance policy and need a partner to help our leadership team set guardrails.',
    url: 'https://example.com/sample/SAMPLE-002' },
  { id: 'SAMPLE-003', platform: 'Dev.to', date: '2026-10-28', topic: 'llm',
    title: 'Fine-tuning a small model on my laptop',
    excerpt: 'A weekend experiment fine-tuning an open model for personal note search.',
    url: 'https://example.com/sample/SAMPLE-003' },
  { id: 'SAMPLE-004', platform: 'Hashnode', date: '2026-10-30', topic: 'rag',
    title: 'What I learned building a RAG chatbot',
    excerpt: 'Notes from a hobby project: chunk sizes, embeddings and how I evaluated the answers.',
    url: 'https://example.com/sample/SAMPLE-004' },
  { id: 'SAMPLE-005', platform: 'Discourse', date: '2026-11-06', topic: 'ai-leadership',
    title: 'Recommendations for AI leadership training for directors?',
    excerpt: 'Our department heads need practical AI strategy training. Looking for recommendations on programs that cover adoption roadmaps.',
    url: 'https://example.com/sample/SAMPLE-005' },
  { id: 'SAMPLE-006', platform: 'Bluesky', date: '2026-11-01', topic: 'cooking',
    title: 'Best sourdough starter tips',
    excerpt: 'Feeding schedule questions for a new starter.',
    url: 'https://example.com/sample/SAMPLE-006' },
  { id: 'SAMPLE-007', platform: 'YouTube', date: '2026-10-25', topic: 'llm',
    title: 'Explaining transformers in 10 minutes',
    excerpt: 'A beginner-friendly video on how attention works in large language models.',
    url: 'https://example.com/sample/SAMPLE-007' },
  { id: 'SAMPLE-008', platform: 'Product Hunt', date: '2026-11-03', topic: 'ai-tools',
    title: 'Launch: an AI meeting-notes app',
    excerpt: 'Product launch post for a note-taking tool with AI summaries.',
    url: 'https://example.com/sample/SAMPLE-008' },
  { id: 'SAMPLE-009', platform: 'Reddit', date: '2026-11-02', topic: 'ai-training',
    title: 'Looking for an AI upskilling program for our analytics team',
    excerpt: 'Shared copy of the same discussion, reached through a tracking link.',
    url: 'HTTPS://Example.com/sample/SAMPLE-001/?utm_source=share#top' },
  { id: 'SAMPLE-010', platform: 'Hacker News', date: '2026-10-29', topic: 'outdoors',
    title: 'Weekend hiking trails near Austin',
    excerpt: 'Looking for moderate trails with shade for a family trip.',
    url: 'https://example.com/sample/SAMPLE-010' },
  { id: 'SAMPLE-011', platform: 'Discourse', date: '2026-11-07', topic: 'ai-adoption',
    title: 'Our team wants to adopt Claude for internal workflows: where to start?',
    excerpt: 'We are an operations team at a logistics company evaluating AI tools and looking for a training partner to onboard staff.',
    url: 'https://example.com/sample/SAMPLE-011' },
  { id: 'SAMPLE-002', platform: 'Hacker News', date: '2026-11-04', topic: 'ai-governance',
    title: 'How are you governing LLM use across departments?',
    excerpt: 'Repeated copy of SAMPLE-002 with the same record id.',
    url: 'https://example.com/sample/SAMPLE-002-repost' },
].map((r) => Object.freeze({ ...r, sample: true })));
