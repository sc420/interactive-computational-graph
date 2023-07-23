import type GraphNode from "./GraphNode";
import NodeRelationship from "./NodeRelationship";
import type Operation from "./Operation";
import type Port from "./Port";
import {
  type NodeData,
  type NodeIdToNodeData,
  type PortToNodesData,
} from "./PortToNodesData";

class OperationNode implements GraphNode {
  private readonly id: string;

  private readonly inputPorts: Port[];

  private readonly nodeRelationship: NodeRelationship;

  private readonly operation: Operation;

  private value: number = 0;

  private dfdy: number = 0;

  constructor(id: string, inputPorts: Port[], operation: Operation) {
    this.id = id;
    this.inputPorts = inputPorts;
    this.nodeRelationship = new NodeRelationship(this.inputPorts);
    this.operation = operation;
  }

  getId(): string {
    return this.id;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    throw new Error("Operation node should only update f, not set a value");
  }

  getDfdy(): number {
    return this.dfdy;
  }

  updateF(): void {
    const portToNodeData = this.buildPortToNodesData();
    this.value = this.operation.evalF(portToNodeData);
  }

  updateDfdy(y: GraphNode): void {
    const portToNodeData = this.buildPortToNodesData();
    const yNodeData = this.buildNodeData(y);
    this.dfdy = this.operation.evalDfdy(portToNodeData, yNodeData);
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }

  private buildPortToNodesData(): PortToNodesData {
    const portToNodesData: PortToNodesData = {};
    this.addInputPortToNodesData(portToNodesData);
    this.addOutputPortToNodesData(portToNodesData);
    return portToNodesData;
  }

  private addInputPortToNodesData(portToNodesData: PortToNodesData): void {
    this.inputPorts.forEach((inputPort) => {
      const portId = inputPort.getId();
      const inputNodes = this.nodeRelationship.getInputNodesByPort(portId);
      portToNodesData[portId] = this.buildNodeIdToNodeData(inputNodes);
    });
  }

  private addOutputPortToNodesData(portToNodesData: PortToNodesData): void {
    const outputNodes = this.nodeRelationship.getOutputNodes();
    portToNodesData[this.nodeRelationship.outputPort.getId()] =
      this.buildNodeIdToNodeData(outputNodes);
  }

  private buildNodeIdToNodeData(nodes: GraphNode[]): NodeIdToNodeData {
    const nodeIdToNodeData: NodeIdToNodeData = {};
    nodes.forEach((node) => {
      nodeIdToNodeData[node.getId()] = this.buildNodeData(node);
    });
    return nodeIdToNodeData;
  }

  private buildNodeData(node: GraphNode): NodeData {
    return { value: node.getValue() };
  }
}

export default OperationNode;
