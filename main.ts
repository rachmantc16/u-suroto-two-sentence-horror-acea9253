// Two-Sentence Horror — entrypoint (Node 22, standard library only).
//
// This program writes one horror story of exactly two sentences to
// /output/entry.txt, where the make.fun gate scorer reads it. The gate
// accepts UTF-8 text of 1 to 400 characters that is not only whitespace,
// and the judge only frightens well when the second sentence re-reads the
// first one worse — so the story below is built around a single reveal:
// a night nurse who never moved, and a silent mother who now speaks in
// the nurse's voice. Nothing is explained; the reader supplies the rest.
//
// Before writing, the program validates its own story against the gate
// (character count, non-blank, exactly two sentence-ending marks) and
// refuses to emit an invalid entry. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STORY =
  "The night nurse swore she never left my mother's room, and the hallway camera proved it: she stood at the foot of the bed for six hours without blinking, without breathing. " +
  "This morning Mother, who has not spoken in two years, sat up, smiled, and whispered my name in the nurse's voice.";

const MAX_CHARS = 400;

function countSentences(text: string): number {
  const matches = text.match(/[.!?]+(?=\s|$)/g);
  return matches ? matches.length : 0;
}

function validate(story: string): void {
  if (story.trim().length === 0) {
    throw new Error('story is blank');
  }
  if (story.length > MAX_CHARS) {
    throw new Error(`story is ${story.length} characters, over the ${MAX_CHARS} cap`);
  }
  const sentences = countSentences(story);
  if (sentences !== 2) {
    throw new Error(`story has ${sentences} sentences, must be exactly 2`);
  }
}

function main(): void {
  validate(STORY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'entry.txt');
  writeFileSync(outPath, STORY, 'utf8');
  console.log(`wrote ${outPath}: ${STORY.length} chars, ${countSentences(STORY)} sentences`);
}

main();
