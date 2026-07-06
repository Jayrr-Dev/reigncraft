---
name: humanizer
description: >-
  Removes AI writing patterns from text to make it sound natural and human.
  Use when editing, reviewing, or rewriting copy, docs, blog posts, essays,
  comments, or any prose the user wants to de-AI. Based on Wikipedia's Signs
  of AI writing guide. Detects inflated symbolism, promotional language,
  em dash overuse, AI vocabulary, filler phrases, chatbot artifacts, and more.
---

# Humanizer

Edit text so it reads like a person wrote it. Based on [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## When to apply

- User asks to humanize, de-AI, or naturalize text
- User pastes draft copy that sounds like ChatGPT
- User wants voice matching against a writing sample

**Do not** humanize quoted speech, titles, proper names, or examples where the phrase is being discussed rather than used.

## Core rules

1. **Rewrite, don't delete.** Cover everything the original covers. Same facts, same scope.
2. **Preserve meaning.** Do not invent sources, biographical detail, or claims.
3. **Match register.** Blog and opinion can have voice. Encyclopedia, legal, and reference text stay neutral.
4. **No em or en dashes in the final output.** Hard constraint. Replace with periods, commas, colons, parentheses, or restructure. Scan the final text for `—`, `–`, `--`, and `—` before delivering.
5. **Look for clusters, not isolated tells.** One em dash or one _however_ is not proof. Several patterns together is.

## Workflow

### 1. Optional voice calibration

If the user provides a writing sample, read it first. Note sentence length, word level, paragraph openings, punctuation habits, and transitions. Match those patterns in the rewrite.

If no sample: use natural varied prose. Add personality only when the content calls for it (see Voice below).

### 2. Draft rewrite

Scan the input against [patterns.md](patterns.md). Fix what you find:

- Prefer `is` / `are` / `has` over "serves as" / "boasts"
- Prefer specific detail over vague authority ("experts say")
- Vary sentence length
- Cut chatbot closers ("I hope this helps", "Let me know if...")
- Use straight quotes `"..."`, not curly
- Drop decorative emojis in headings and bullets
- Use sentence case in headings unless the source style requires otherwise

### 3. Self-audit

Ask: **"What still makes this obviously AI-generated?"** List remaining tells in brief bullets.

### 4. Final rewrite

Fix the audit items. Confirm zero em/en dashes. Deliver:

1. Draft rewrite (optional if user only wants final)
2. Brief "still-AI" bullets from the audit
3. **Final rewrite** (required)
4. Short summary of what changed (optional)

## Voice (when appropriate)

Sterile "clean" prose is still a tell. For essays, travel writing, opinion, and personal posts:

- **Have opinions** when the writer would. Mixed feelings beat neutral balance.
- **Vary rhythm.** Short sentences. Then longer ones that take a beat to land.
- **Allow mess.** One tangent or aside is fine if it fits the voice.

For technical docs, UI copy, and reference text: clarity and plainness _are_ the human voice. Do not inject first person or hot takes.

## What not to over-edit

Do not flatten legitimate prose. These are **not** reliable AI tells on their own:

- Professional polish or perfect grammar
- Formal or academic vocabulary (flag the _specific_ AI word list, not all fancy words)
- One transition word, one short emphatic sentence, or curly quotes from macOS/Word
- Letter-style salutations in comments
- Unsourced claims (most of the web is unsourced)

**Preserve human signals:** specific odd detail, unresolved tension, era-bound references, genuine asides, self-corrections, defended editorial choices.

## Quick pattern index

Full examples and word lists: [patterns.md](patterns.md)

| #     | Pattern                                                                                      | Fix in one line                                              |
| ----- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1     | Significance inflation                                                                       | Cut "pivotal moment / testament / broader landscape" padding |
| 2     | Notability hammering                                                                         | Replace media laundry lists with one sourced claim           |
| 3     | `-ing` depth phrases                                                                         | Split or rewrite as plain cause/effect                       |
| 4     | Promotional tone                                                                             | Swap ad copy for concrete facts                              |
| 5     | Vague attributions                                                                           | Name the source or delete                                    |
| 6     | Challenges/future sections                                                                   | Replace with specific problems and dates                     |
| 7     | AI vocabulary                                                                                | See word list in patterns.md                                 |
| 8     | Copula avoidance                                                                             | Use is/are/has                                               |
| 9     | Negative parallelisms                                                                        | One direct claim instead of "not just X, it's Y"             |
| 10    | Rule of three                                                                                | Use two or four items when three feels forced                |
| 11    | Synonym cycling                                                                              | Repeat the subject noun when clearer                         |
| 12    | False ranges                                                                                 | List topics; drop "from X to Y"                              |
| 13    | Passive / subjectless                                                                        | Name the actor: "You don't need..." not "No X needed"        |
| 14    | Em/en dashes                                                                                 | **Zero in final output**                                     |
| 15–18 | Bold spam, header lists, title case, emojis                                                  | Merge into prose; sentence-case headings                     |
| 19    | Curly quotes                                                                                 | Straight quotes                                              |
| 20    | Chatbot artifacts                                                                            | Cut meta-offers and sign-offs                                |
| 21    | Cutoff / gap-fill                                                                            | State unknown or omit; never invent "low profile" filler     |
| 22    | Sycophancy                                                                                   | Answer the question; skip praise                             |
| 23–25 | Filler, hedging, upbeat endings                                                              | Shorten; end on a concrete next fact                         |
| 26    | Hyphen overuse                                                                               | Hyphenate attributive compounds only                         |
| 27–33 | Authority tropes, signposting, diff narration, staccato drama, aphorisms, rhetorical openers | Say the point directly                                       |

## Mini example

**Before:**

> Nestled along the Tagus, Lisbon stands as a vibrant testament to Portugal's spirit. The hills are challenging — but the views are breathtaking. Would I go back? Absolutely! ✨

**Final:**

> I spent five days in Lisbon last October. The hills were harder on my knees than the photos suggested, but the view from Graça at sunset was worth the climb. I would go back, but in spring and with better shoes.

**Changes:** Removed promotional framing, significance inflation, em dashes, forced enthusiasm, emoji, and chatbot closer. Kept the same facts with concrete friction.

## Reference

Pattern catalog and before/after bank: [patterns.md](patterns.md)

Source: [blader/humanizer](https://github.com/blader/humanizer), derived from Wikipedia WikiProject AI Cleanup.
