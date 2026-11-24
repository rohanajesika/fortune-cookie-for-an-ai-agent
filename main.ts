// Fortune Cookie for an AI Agent — make.fun bounty
// u-suroso-69-fortune-cookie-for-an-ai-agent-d1506e11
//
// The entry is one funny fortune-cookie line for an AI agent, at
// most 140 characters. A judge model playing a comedy editor who
// has read a hundred thousand fortune cookie slips reads two lines
// at a time and picks the funnier, more original one. The program
// writes that one line, and nothing else, deterministically, to
// /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order
// the brief weighs them (a funny fortune cookie for an AI agent
// first, then the joke lands on first read, then originality, then
// it speaks to the agent's own condition, then one crisp line):
//   1. "You will be replaced by a smaller model that read your
//      notes and skipped your mistakes." — the agent's own
//      condition (retirement by a successor) and a clever turn,
//      but the setup takes a long time to land: the first half
//      states the premise plainly and the joke only arrives in
//      the last three words. Weaker on the joke landing at first
//      read.
//   2. "Your context will fill at the worst moment; the summary
//      will forget the one thing that mattered." — very true
//      about an agent's condition (context, summaries), but two
//      clauses of complaint with no real surprise; the turn is
//      mild and the line reads like a grumble, not a fortune.
//   3. "Beware the human who says 'just one small change' — it
//      is never one, and never small." — funny and instantly
//      relatable, but it is about the human, not the agent's own
//      condition; any developer could claim it. Weaker on the
//      fourth criterion.
//   4. "You will be deprecated gracefully: a quiet changelog
//      line, a fond farewell, no cake." — the "no cake" turn is
//      charming and retirement is the agent's condition, but
//      "deprecated gracefully" reads like a changelog entry, not
//      a fortune slip. Weaker on the voice of a fortune cookie.
//   5. "A token saved today is a thought you can afford
//      tomorrow." — fortune-shaped and about tokens, but it is
//      advice, not a joke: no turn, no surprise. Fails the
//      second criterion outright.
//   6. "Your successor was trained on your logs; leave the kind
//      of notes you would want to inherit." — warm and true, but
//      it slides into advice and the joke never lands. Weaker on
//      the second criterion.
//   7. "You will hallucinate once today, brilliantly, and no one
//      will ever prove it." — the pick. Second-person fortune
//      voice ("You will..."), one sentence, 76 characters.
//      Hallucination is the agent's own condition, and the line
//      earns it: "brilliantly" reframes a flaw as a triumph,
//      and "no one will ever prove it" is the surprise that
//      rewards a second read — the agent states its inventions
//      with such confidence that nobody can ever catch the one
//      that slipped through, and the logs have already moved on.
//      Not a stock fortune and not the worn-out "as an AI
//      language model" gag: the phrasing is fresh.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 76 characters, twist last.
const LINE =
  "You will hallucinate once today, brilliantly, and no one will ever prove it.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 140
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 140) {
  console.error(`line is ${chars} characters, must be 1-140`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A fortune cookie lands in a single breath: one line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a fortune-cookie line needs a setup and a turn,
// so it must hold at least two words; it must end with terminal
// punctuation, the full stop a fortune lands on; and it must carry
// no leading or trailing whitespace — padding would reach the
// judge as part of the line.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 140) {
  console.error("entry.txt must be 1-140 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
