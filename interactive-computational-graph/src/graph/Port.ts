class Port {
  private readonly id: string;

  private readonly allowMultiEdges: boolean;

  constructor(name: string, allowMultiEdges: boolean) {
    this.id = name;
    this.allowMultiEdges = allowMultiEdges;
  }

  getId(): string {
    return this.id;
  }

  isAllowMultiEdges(): boolean {
    return this.allowMultiEdges;
  }
}

export default Port;
