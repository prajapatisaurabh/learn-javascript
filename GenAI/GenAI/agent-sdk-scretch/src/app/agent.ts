export interface IMessage {
  role: "developer" | "user" | "assistant";
  content: string;
}

export class AgentBuilder {
  public instructions: string | undefined;

  constructor() {}

  public setInstructions(instructions: string): AgentBuilder {
    this.instructions = instructions;
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
