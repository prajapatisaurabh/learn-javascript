export class AgentBuilder {
  public instructions: string | undefined;

  constructor() {}

  public setInstructions(instructions: string): AgentBuilder {
    this.instructions = instructions;
    return this;
  }

  public build(): Agent {
    return new Agent();
  }
}

export class Agent {
  static builder(): AgentBuilder {
    return new AgentBuilder();
  }

  public async run(input: string): Promise<void> {
    console.log(`Agent received input: ${input}`);
    // Here you can implement the logic to process the input and generate a response.
    // For demonstration purposes, we'll just log a simple response.
    console.log(`Agent response: I can assist you with that!`);
  }
}
