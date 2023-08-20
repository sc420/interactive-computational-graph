import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";
import type Operation from "./Operation";
import type Port from "./Port";
import {
  type NodeData,
  type NodeIdToNodeData,
  type PortToNodesData,
} from "./PortToNodesData";

class OperationNode implements CoreNode {
  private readonly id: string;

  private readonly inputPorts: Port[];

  private readonly nodeRelationship: NodeRelationship;

  private readonly operation: Operation;

  private value: number = 0;

  constructor(id: string, inputPorts: Port[], operation: Operation) {
    this.id = id;
    this.inputPorts = inputPorts;
    this.nodeRelationship = new NodeRelationship(this.inputPorts);
    this.operation = operation;
  }

  getType(): NodeType {
    return "OPERATION";
  }

  getId(): string {
    return this.id;
  }

  isConstant(): boolean {
    return false;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    throw new Error("Operation node should only update f, not set a value");
  }

  updateF(): void {
    const portToNodeData = this.buildPortToNodesData();
    this.value = this.operation.evalF(portToNodeData);
  }

  calculateDfdy(y: CoreNode): number {
    if (y.isConstant()) {
      return 0;
    }
    if (y.getId() === this.getId()) {
      return 1;
    }
    const portToNodeData = this.buildPortToNodesData();
    const yNodeData = this.buildNodeData(y);
    return this.operation.evalDfdy(portToNodeData, yNodeData);
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

  private buildNodeIdToNodeData(nodes: CoreNode[]): NodeIdToNodeData {
    const nodeIdToNodeData: NodeIdToNodeData = {};
    nodes.forEach((node) => {
      nodeIdToNodeData[node.getId()] = this.buildNodeData(node);
    });
    return nodeIdToNodeData;
  }

  private buildNodeData(node: CoreNode): NodeData {
    return { id: node.getId(), value: node.getValue() };
  }
}

export default OperationNode;
