import OpenAI from "openai";
import { HARNESS_PROMPT } from "./config.js";

export interface IMessage {
  role: "developer" | "user" | "assistant";
  content: string;
}

export interface ITool {
  name: string;
  description: string;
  doc?: string;
  execute: (input: string) => Promise<string>;
}

/** Shape the model is asked to return by HARNESS_PROMPT. */
export interface IHarnessResponse {
  Initial?: { summary?: string; key_concepts?: string[] };
  Think?: { approach?: string; potential_challenges?: string[] };
  Analyze?: { patterns?: string[]; potential_solutions?: string[] };
  "Tool Request"?: { tool?: string | null; tool_input?: string | null };
  Output?: { final_result?: string | number; summary?: string };
}

export class AgentBuilder {
  public instructions: string | undefined;
  public toolList: ITool[];
  public model = "gpt-4.1-mini";

  constructor() {
    this.toolList = [];
  }

  public setInstructions(instructions: string): AgentBuilder {
    this.instructions = instructions;
    return this;
  }

  public setModel(model: string): AgentBuilder {
    this.model = model;
    return this;
  }

  public tool(t: ITool): AgentBuilder {
    this.toolList.push(t);
    return this;
  }

  public build(): Agent {
    return new Agent(this);
  }
}

export class Agent {
  private instructions: string;
  private messagesHistory: IMessage[] = [];
  private toolMap: Map<string, ITool>;
  private MAX_Loops = 30;
  private model: string;
  private client: OpenAI;

  constructor(builder: AgentBuilder) {
    this.toolMap = new Map<string, ITool>();
    this.model = builder.model;
    // Reads OPENAI_API_KEY from the environment.
    this.client = new OpenAI();

    for (const tool of builder.toolList) {
      this.toolMap.set(tool.name, tool);
    }

    this.instructions = `
      ${HARNESS_PROMPT}\n\n



      System Instructions:
      ${builder.instructions}


      Available Tools:
      ${builder.toolList.map((t) => JSON.stringify({ name: t.name, description: t.description, doc: t.doc })).join("\n")}
    `;
    this.messagesHistory = [];
  }

  static builder(): AgentBuilder {
    return new AgentBuilder();
  }

  public printSystemPrompt(): void {
    console.log("System Prompt:");
    console.log(this.instructions);
  }

  public async run(input: string): Promise<string> {
    // Append the user query to the message history.
    this.messagesHistory.push({ role: "user", content: input });

    for (let i = 0; i < this.MAX_Loops; i++) {
      // Call the LLM with the system instructions + the whole message history.
      const raw = await this.callLLM();

      // Append the LLM response to the message history.
      this.messagesHistory.push({ role: "assistant", content: raw });

      const response = this.parseResponse(raw);
      if (!response) {
        // Malformed JSON: tell the model and let it retry on the next loop.
        this.messagesHistory.push({
          role: "developer",
          content:
            "Your last message was not valid JSON. Reply again using the required JSON format only.",
        });
        continue;
      }

      const toolName = response["Tool Request"]?.tool;
      const toolInput = response["Tool Request"]?.tool_input;

      // If the LLM asked for a tool, run it and feed the result back into the loop.
      if (toolName) {
        const tool = this.toolMap.get(toolName);
        const toolResult = tool
          ? await tool.execute(toolInput ?? "")
          : `Error: no tool named "${toolName}" is available.`;

        console.log(`🛠  ${toolName}(${toolInput ?? ""}) -> ${toolResult}`);

        // Append the tool result to the message history and continue the loop.
        this.messagesHistory.push({
          role: "developer",
          content: `TOOL RESULT for "${toolName}":\n${toolResult}`,
        });
        continue;
      }

      // No tool requested: this turn carries the final answer, so stop.
      const finalResult = response.Output?.final_result;
      if (finalResult !== undefined) {
        return String(finalResult);
      }

      // Neither a tool request nor an output: nudge the model and keep looping.
      this.messagesHistory.push({
        role: "developer",
        content:
          'Your last message had neither a "Tool Request" nor an "Output". Provide one of them.',
      });
    }

    throw new Error(
      `Agent stopped after ${this.MAX_Loops} loops without producing a final output.`,
    );
  }

  private async callLLM(): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "developer", content: this.instructions },
        ...this.messagesHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    return completion.choices[0]?.message.content ?? "";
  }

  private parseResponse(raw: string): IHarnessResponse | null {
    try {
      return JSON.parse(raw) as IHarnessResponse;
    } catch {
      return null;
    }
  }
}
