import type CoreNode from "./CoreNode";
import Port from "./Port";

interface PortData {
  port: Port;
  connectedNodes: CoreNode[];
}

class NodeRelationship {
  private readonly inputPortIdToPortData = new Map<string, PortData>();

  private readonly outputPortIdToPortData = new Map<string, PortData>();

  public readonly inputPorts: Port[];

  public readonly outputPort: Port = new Port("output", true);

  constructor(inputPorts: Port[]) {
    this.inputPorts = inputPorts;
    this.initInputPortIdToPortData();
    this.initOutputPortIdToPortData();
  }

  isInputPortEmpty(portId: string): boolean {
    const inputNodes = this.getInputNodesByPort(portId);
    return inputNodes.length === 0;
  }

  isOutputPortEmpty(): boolean {
    const outputNodes = this.getOutputNodes();
    return outputNodes.length === 0;
  }

  getInputNodesByPort(portId: string): CoreNode[] {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );
    return inputPortData.connectedNodes;
  }

  getInputNodes(): CoreNode[] {
    const inputNodes: CoreNode[] = [];
    this.inputPortIdToPortData.forEach((_, inputPort) => {
      inputNodes.push(...this.getInputNodesByPort(inputPort));
    });
    return inputNodes;
  }

  getOutputNodes(): CoreNode[] {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    return outputPortData.connectedNodes;
  }

  hasInputNodeByPort(portId: string, nodeId: string): boolean {
    const inputNodes = this.getInputNodesByPort(portId);
    return inputNodes.some((node) => node.getId() === nodeId);
  }

  canAddInputNodeByPort(portId: string): boolean {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );

    if (
      !inputPortData.port.isAllowMultiEdges() &&
      inputPortData.connectedNodes.length > 0
    ) {
      return false;
    }

    return true;
  }

  addInputNodeByPort(portId: string, inputNode: CoreNode): void {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );

    if (this.isNodeConnected(inputPortData.connectedNodes, inputNode.getId())) {
      throw new Error(
        `Input node ${inputNode.getId()} already exists by port ${portId}`,
      );
    }

    if (
      inputPortData.connectedNodes.length >= 1 &&
      !inputPortData.port.isAllowMultiEdges()
    ) {
      throw new Error(
        `Input port ${inputPortData.port.getId()} doesn't allow multiple edges`,
      );
    }

    inputPortData.connectedNodes.push(inputNode);
  }

  addOutputNode(outputNode: CoreNode): void {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    outputPortData.connectedNodes.push(outputNode);
  }

  removeInputNodeByPort(portId: string, nodeId: string): void {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );
    if (!this.isNodeConnected(inputPortData.connectedNodes, nodeId)) {
      throw new Error(`Input node ${nodeId} doesn't exist by port ${portId}`);
    }
    inputPortData.connectedNodes = this.removeConnectedNode(
      inputPortData.connectedNodes,
      nodeId,
    );
  }

  removeOutputNode(nodeId: string): void {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    if (!this.isNodeConnected(outputPortData.connectedNodes, nodeId)) {
      throw new Error(`Output node ${nodeId} doesn't exist`);
    }
    outputPortData.connectedNodes = this.removeConnectedNode(
      outputPortData.connectedNodes,
      nodeId,
    );
  }

  private initInputPortIdToPortData(): void {
    this.inputPorts.forEach((inputPort) => {
      const portData: PortData = {
        port: inputPort,
        connectedNodes: [],
      };
      this.inputPortIdToPortData.set(inputPort.getId(), portData);
    });
  }

  private initOutputPortIdToPortData(): void {
    const portData: PortData = {
      port: this.outputPort,
      connectedNodes: [],
    };
    this.outputPortIdToPortData.set(this.outputPort.getId(), portData);
  }

  private getPortDataByPort(
    portIdToPortData: Map<string, PortData>,
    portId: string,
  ): PortData {
    const portData = portIdToPortData.get(portId);
    if (portData === undefined) {
      throw new Error(`Input port ${portId} doesn't exist`);
    }
    return portData;
  }

  private isNodeConnected(connectedNodes: CoreNode[], nodeId: string): boolean {
    return connectedNodes.some(
      (connectedNode) => connectedNode.getId() === nodeId,
    );
  }

  private removeConnectedNode(
    connectedNodes: CoreNode[],
    nodeId: string,
  ): CoreNode[] {
    return connectedNodes.filter(
      (connectedNode) => connectedNode.getId() !== nodeId,
    );
  }
}

export default NodeRelationship;
