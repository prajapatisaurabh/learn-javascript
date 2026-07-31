import dotenv from "dotenv";
dotenv.config();

import { Agent } from "./app/agent.js";
import type { ITool } from "./app/agent.js";

const weatherTool: ITool = {
  name: "WeatherTool",
  description: "Provides weather information for a given location.",
  doc: "Use this tool to get the current weather for a specified city or region.",
  execute: async (input: string) => {
    // Simulate fetching weather data (replace with actual API call)
    return `The current weather in ${input} is sunny with a temperature of 25°C.`;
  },
};

async function main() {
  const agent = Agent.builder()
    .setInstructions("You are a helpful assistant.")
    .tool(weatherTool)
    .build();

  agent.attachInterceptor((message) => {
    console.log(`[${message.role.toUpperCase()}]: ${message.content}`);
  });

  const result = await agent.run("What is the weather in Ahmedabad and Patna?");
  console.log("✅", result);
}

main().catch(console.error);
