import { Agent } from "./app/agent.js";

async function main() {
  const agent = Agent.builder()
    .setInstructions("You are a helpful assistant.")
    .build();

  await agent.run("Hello, how can I assist you today?");
}

main().catch(console.error);
