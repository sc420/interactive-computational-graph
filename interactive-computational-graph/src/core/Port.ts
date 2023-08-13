class Port {
  private readonly id: string;

  private readonly allowMultiEdges: boolean;

  constructor(id: string, allowMultiEdges: boolean) {
    this.id = id;
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
