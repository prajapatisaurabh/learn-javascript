import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chain-of-thought (CoT) prompting: instead of asking for just the final
// answer, we ask the model to reason step by step first. Working through
// intermediate steps makes it far more reliable on math/logic problems.

const SYSTEM_PROMPT = `
You are a helpful assistant that solves math word problems.

Think step by step. Break the problem into small steps, show your
reasoning for each step, and only then give the final answer on the
last line in the format:

Answer: <number>
`;

async function main() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "A shopkeeper buys 12 boxes of pens. Each box has 8 pens and costs 96 rupees. He sells each pen for 15 rupees. What is his total profit?",
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
