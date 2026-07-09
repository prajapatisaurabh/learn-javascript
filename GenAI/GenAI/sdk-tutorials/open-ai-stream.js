import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI();

async function run() {
  const result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Write a short poem about the sea.",
    stream: true,
  });

  for await (const chunk of result) {
    console.log(chunk);
  }
}

run();
