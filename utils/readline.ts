import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function readline(text: string = "Enter input: "): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(text, (input) => resolve(input));
  });
}
