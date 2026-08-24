import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Few-shot prompting: we show the model a few examples of the
// input -> output pattern we want, then ask it a new question.
// The model picks up the format and style from the examples.

const SYSTEM_PROMPT = `
You are an AI assistant that classifies the sentiment of a movie review
as Positive, Negative, or Neutral. Reply with only one word.

Examples:

Review: "This movie was an absolute masterpiece, I cried at the end."
Sentiment: Positive

Review: "Two hours of my life I will never get back."
Sentiment: Negative

Review: "It was okay, some parts dragged but the acting was fine."
Sentiment: Neutral
`;

async function main() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          'Review: "The visuals were stunning but the story made no sense at all."\nSentiment:',
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
