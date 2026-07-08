import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI();

async function run() {
  const result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Write a short poem about the sea.",
  });

  console.log(result.output_text);
}

run();
