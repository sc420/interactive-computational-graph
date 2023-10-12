import {
  InputNodeAlreadyConnectedError,
  InputPortFullError,
} from "./CoreErrors";
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

  validateAddInputNodeByPort(portId: string, inputNodeId: string): void {
    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );

    if (this.isNodeConnected(inputPortData.connectedNodes, inputNodeId)) {
      throw new InputNodeAlreadyConnectedError(
        `Input node ${inputNodeId} is already connected to port ${portId}`,
        inputNodeId,
        portId,
      );
    }

    if (
      !inputPortData.port.isAllowMultiEdges() &&
      inputPortData.connectedNodes.length > 0
    ) {
      const inputPort = inputPortData.port.getId();
      throw new InputPortFullError(
        `Input port ${inputPort} doesn't allow multiple edges`,
        inputPort,
      );
    }
  }

  addInputNodeByPort(portId: string, inputNode: CoreNode): void {
    this.validateAddInputNodeByPort(portId, inputNode.getId());

    const inputPortData = this.getPortDataByPort(
      this.inputPortIdToPortData,
      portId,
    );
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
    // Only remove one node even if there're multiple matches
    const indexToRemove = connectedNodes.findIndex(
      (connectedNode) => connectedNode.getId() === nodeId,
    );
    return connectedNodes.filter(function (connectedNode, index) {
      return index !== indexToRemove;
    });
  }
}

export default NodeRelationship;
