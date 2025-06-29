// src/io.ts
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

export async function inputPrompt(prompt: string): Promise<string> {
  return rl.question(prompt);
}

export function outputLine(text: string): void {
  console.log(text);
}
