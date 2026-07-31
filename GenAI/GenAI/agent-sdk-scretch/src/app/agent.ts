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
    this.instructions = instructions;
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

  constructor(builder: AgentBuilder) {
    this.toolMap = new Map<string, ITool>();

    for (const tool of builder.toolList) {
      this.toolMap.set(tool.name, tool);
    }

    this.instructions = `
      ${HARNESS_PROMPT}\n\n



      System Instructions:
      ${builder.instructions}


      Avaliable Tools: 
      ${builder.toolList.map(t = > JSON.stringify({ name: t.name, description: t.description, doc: t.doc })).join("\n")}
    `;
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
