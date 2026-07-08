import "dotenv/config";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const client = new OpenAI();

const riskSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  score: z.number().min(0).max(100),
});

const outputSchema = z.object({
  risks: z.array(riskSchema),
});

async function run() {
  const result = await client.responses.parse({
    model: "gpt-4.1-mini",
    text: {
      format: zodTextFormat(outputSchema, "risks"),
    },
    input:
      "Identify the key risks of launching a new mobile banking app. " +
      "For each risk, give a title, relevant tags, and a score from 0 to 100.",
  });

  console.log(result.output_parsed);
}

run();
