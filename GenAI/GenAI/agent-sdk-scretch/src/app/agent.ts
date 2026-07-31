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

export class AgentBuilder {
  public instructions: string | undefined;
  public toolList: ITool[];

  constructor() {
    this.toolList = [];
  }

  public setInstructions(instructions: string): AgentBuilder {
    this.instructions = `
      ${HARNESS_PROMPT}\n\n

      System Instructions:
      ${instructions}
    `;
    return this;
  }

  public build(): Agent {
    return new Agent(this);
  }
}

export class Agent {
  private instructions: string;
  private messagesHistory: IMessage[] = [];

  constructor(builder: AgentBuilder) {
    this.instructions = builder.instructions ?? "Default instructions";
    this.messagesHistory = [];
  }

  static builder(): AgentBuilder {
    return new AgentBuilder();
  }

  public async run(input: string): Promise<void> {
    console.log(`Agent received input: ${input}`);
    console.log(`Agent response: I can assist you with that!`);
  }
}
