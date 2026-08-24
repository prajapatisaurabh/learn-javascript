import dotenv from "dotenv";
dotenv.config();

import { exec } from "node:child_process";
import { promisify } from "node:util";

import { Agent } from "./app/agent.js";
import type { ITool } from "./app/agent.js";

const execAsync = promisify(exec);

const weatherTool: ITool = {
  name: "WeatherTool",
  description: "Provides weather information for a given location.",
  doc: "Use this tool to get the current weather for a specified city or region.",
  execute: async (input: string) => {
    // Simulate fetching weather data (replace with actual API call)
    return `The current weather in ${input} is sunny with a temperature of 25°C.`;
  },
};

const cliAccessTool: ITool = {
  name: "CLIAccessTool",
  description:
    "Runs a shell command in the current working directory and returns its output.",
  doc: "tool_input is the full shell command, e.g. `ls -la` or `printf '...' > Hello.java`. Commands are non-interactive and time out after 30s.",
  execute: async (input: string) => {
    try {
      const { stdout, stderr } = await execAsync(input, {
        cwd: process.cwd(),
        timeout: 30_000,
        maxBuffer: 1024 * 1024,
      });

      const output = [
        stdout.trim() && `stdout:\n${stdout.trim()}`,
        stderr.trim() && `stderr:\n${stderr.trim()}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      return output || "Command succeeded with no output.";
    } catch (error) {
      // Non-zero exit: report it back so the model can correct itself.
      const { message, stdout, stderr } = error as Error & {
        stdout?: string;
        stderr?: string;
      };
      return `Command failed: ${message}\n${stderr?.trim() ?? ""}\n${stdout?.trim() ?? ""}`.trim();
    }
  },
};

async function main() {
  const agent = Agent.builder()
    .setInstructions("You are a helpful coding  assistant.")
    .tool(weatherTool)
    .tool(cliAccessTool)
    .build();

  agent.attachInterceptor((message) => {
    console.log(`[${message.role.toUpperCase()}]: ${message.content}`);
  });

  const result = await agent.run(
    "can you please build a simple hello world in java. craet a file in current directory and write there",
  );
  console.log("✅", result);
}

main().catch(console.error);
