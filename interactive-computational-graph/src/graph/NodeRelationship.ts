import type GraphNode from "./GraphNode";
import Port from "./Port";

interface PortData {
  port: Port;
  nodeIdToNodes: Map<string, GraphNode>;
}

class NodeRelationship {
  private readonly inputPortIdToPortData: Map<string, PortData> = new Map<
    string,
    PortData
  >();

  private readonly outputPortIdToPortData: Map<string, PortData> = new Map<
    string,
    PortData
  >();

  public readonly outputPort: Port = new Port("output", true);

  constructor(inputPorts: Port[]) {
    this.initInputPortIdToPortData(inputPorts);
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

  getInputNodesByPort(portId: string): GraphNode[] {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );
    return Array.from(inputPortData.nodeIdToNodes.values());
  }

  getOneInputNodeByPort(portId: string): GraphNode {
    const inputNodes = this.getInputNodesByPort(portId);
    if (inputNodes.length !== 1) {
      throw new Error(`Input port ${portId} has ${inputNodes.length} nodes`);
    }
    return inputNodes[0];
  }

  getOutputNodes(): GraphNode[] {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    return Array.from(outputPortData.nodeIdToNodes.values());
  }

  hasInputNodeByPort(portId: string, nodeId: string): boolean {
    const inputNodes = this.getInputNodesByPort(portId);
    return inputNodes.some((node) => node.getId() === nodeId);
  }

  addInputNodeByPort(portId: string, inputNode: GraphNode): void {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );

    if (inputPortData.nodeIdToNodes.has(inputNode.getId())) {
      throw new Error(
        `Input node ${inputNode.getId()} already exists by port ${portId}`,
      );
    }

    if (
      inputPortData.nodeIdToNodes.size >= 1 &&
      !inputPortData.port.isAllowMultiEdges()
    ) {
      throw new Error(
        `Input port ${inputPortData.port.getId()} doesn't allow multiple edges`,
      );
    }

    inputPortData.nodeIdToNodes.set(inputNode.getId(), inputNode);
  }

  addOutputNode(outputNode: GraphNode): void {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    if (outputPortData.nodeIdToNodes.has(outputNode.getId())) {
      throw new Error(`Output node ${outputNode.getId()} already exists`);
    }
    outputPortData.nodeIdToNodes.set(outputNode.getId(), outputNode);
  }

  removeInputNodeByPort(portId: string, nodeId: string): void {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );
    const success = inputPortData.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Input node ${nodeId} doesn't exist by port ${portId}`);
    }
  }

  removeOutputNode(nodeId: string): void {
    const outputPortData = this.getPortDataByPort(
      this.outputPortIdToPortData,
      this.outputPort.getId(),
    );
    const success = outputPortData.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Output node ${nodeId} doesn't exist`);
    }
  }

  private initInputPortIdToPortData(inputPorts: Port[]): void {
    inputPorts.forEach((inputPort) => {
      const portData: PortData = {
        port: inputPort,
        nodeIdToNodes: new Map<string, GraphNode>(),
      };
      this.inputPortIdToPortData.set(inputPort.getId(), portData);
    });
  }

  private initOutputPortIdToPortData(): void {
    const portData: PortData = {
      port: this.outputPort,
      nodeIdToNodes: new Map<string, GraphNode>(),
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
}

export default NodeRelationship;
