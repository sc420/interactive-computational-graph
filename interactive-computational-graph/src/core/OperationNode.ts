import type CoreNodeState from "../states/CoreNodeState";
import type CoreNode from "./CoreNode";
import NodeRelationship from "./NodeRelationship";
import type NodeType from "./NodeType";
import type Operation from "./Operation";
import type Port from "./Port";

class OperationNode implements CoreNode {
  private readonly id: string;

  private readonly inputPorts: Port[];

  private readonly nodeRelationship: NodeRelationship;

  private readonly operationId: string;

  private readonly operation: Operation;

  private value: string = "0";

  constructor(
    id: string,
    inputPorts: Port[],
    operationId: string,
    operation: Operation,
  ) {
    this.id = id;
    this.inputPorts = inputPorts;
    this.nodeRelationship = new NodeRelationship(this.inputPorts);
    this.operationId = operationId;
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

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    throw new Error("Operation node should only update f, not set a value");
  }

  updateF(): void {
    const fInputPortToNodes = this.buildFInputPortToNodes();
    const fInputNodeToValues = this.buildFInputNodeToValues();
    this.value = this.operation.evalF(fInputPortToNodes, fInputNodeToValues);
  }

  calculateDfdx(x: CoreNode): string {
    if (x.isConstant()) {
      return "0";
    }
    if (x.getId() === this.getId()) {
      return "1";
    }
    const fInputPortToNodes = this.buildFInputPortToNodes();
    const fInputNodeToValues = this.buildFInputNodeToValues();
    return this.operation.evalDfdx(
      fInputPortToNodes,
      fInputNodeToValues,
      x.getId(),
    );
  }

  getRelationship(): NodeRelationship {
    return this.nodeRelationship;
  }

  private buildFInputPortToNodes(): Record<string, string[]> {
    const fInputPortToNodes: Record<string, string[]> = {};
    this.inputPorts.forEach((inputPort) => {
      const inputPortId = inputPort.getId();
      const inputNodes = this.nodeRelationship.getInputNodesByPort(inputPortId);
      const inputNodeIds = inputNodes.map((node) => node.getId());
      fInputPortToNodes[inputPortId] = inputNodeIds;
    });
    return fInputPortToNodes;
  }

  private buildFInputNodeToValues(): Record<string, string> {
    const fInputNodeToValues: Record<string, string> = {};
    this.inputPorts.forEach((inputPort) => {
      const inputPortId = inputPort.getId();
      const inputNodes = this.nodeRelationship.getInputNodesByPort(inputPortId);
      inputNodes.forEach((inputNode) => {
        fInputNodeToValues[inputNode.getId()] = inputNode.getValue();
      });
    });
    return fInputNodeToValues;
  }

  save(): CoreNodeState {
    return {
      nodeType: "OPERATION",
      operationId: this.operationId,
      relationship: this.nodeRelationship.save(),
    };
  }
}

export default OperationNode;
