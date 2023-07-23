import type GraphNode from "./GraphNode";
import Port from "./Port";

class NodeRelationship {
  private readonly inputPortToNodes: Map<string, Map<string, GraphNode>> =
    new Map<string, Map<string, GraphNode>>();

  public readonly outputPort: Port = new Port("output", true);

  private readonly outputNodes: Map<string, GraphNode> = new Map<
    string,
    GraphNode
  >();

  constructor(inputPorts: Port[]) {
    inputPorts.forEach((inputPort) => {
      const nodes = new Map<string, GraphNode>();
      this.inputPortToNodes.set(inputPort.getId(), nodes);
    });
  }

  isInputPortEmpty(portId: string): boolean {
    const inputNodes = this.getInputNodesByPort(portId);
    return inputNodes.length === 0;
  }

  isOutputPortEmpty(): boolean {
    return this.outputNodes.size === 0;
  }

  getInputNodesByPort(portId: string): GraphNode[] {
    const inputNodes = this.getInputNodesAsMapByPort(portId);
    return Array.from(inputNodes.values());
  }

  getOneInputNodeByPort(portId: string): GraphNode {
    const inputNodes = this.getInputNodesByPort(portId);
    if (inputNodes.length !== 1) {
      throw new Error(`Input port ${portId} has ${inputNodes.length} nodes`);
    }
    return inputNodes[0];
  }

  getOutputNodes(): GraphNode[] {
    return Array.from(this.outputNodes.values());
  }

  hasInputNodeByPort(portId: string, nodeId: string): boolean {
    const inputNodes = this.getInputNodesByPort(portId);
    return inputNodes.some((node) => node.getId() === nodeId);
  }

  addInputNodeByPort(portId: string, inputNode: GraphNode): void {
    const inputNodes = this.getInputNodesAsMapByPort(portId);
    if (inputNodes.has(inputNode.getId())) {
      throw new Error(
        `Input node ${inputNode.getId()} already exists by port ${portId}`,
      );
    }
    inputNodes.set(inputNode.getId(), inputNode);
  }

  addOutputNode(outputNode: GraphNode): void {
    if (this.outputNodes.has(outputNode.getId())) {
      throw new Error(`Output node ${outputNode.getId()} already exists`);
    }
    this.outputNodes.set(outputNode.getId(), outputNode);
  }

  removeInputNodeByPort(portId: string, inputNode: GraphNode): void {
    const inputNodes = this.getInputNodesAsMapByPort(portId);
    const success = inputNodes.delete(inputNode.getId());
    if (!success) {
      throw new Error(
        `Input node ${inputNode.getId()} doesn't exist by port ${portId}`,
      );
    }
  }

  removeOutputNode(outputNode: GraphNode): void {
    const success = this.outputNodes.delete(outputNode.getId());
    if (!success) {
      throw new Error(`Output node ${outputNode.getId()} doesn't exist`);
    }
  }

  private getInputNodesAsMapByPort(portId: string): Map<string, GraphNode> {
    const inputNodes = this.inputPortToNodes.get(portId);
    if (inputNodes === undefined) {
      throw new Error(`Input port ${portId} doesn't exist`);
    }
    return inputNodes;
  }
}

export default NodeRelationship;
