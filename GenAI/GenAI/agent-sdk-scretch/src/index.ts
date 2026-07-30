import { Agent } from "./app/agent.js";

async function main() {
  const agent = Agent.builder()
    .setInstructions("You are a helpful assistant.")
    .build();

  agent.run("Hello, how can I assist you today?");
}
