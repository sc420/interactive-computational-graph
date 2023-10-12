class CycleError extends Error {
  node1Id: string;
  node2Id: string;

  constructor(message: string, node1Id: string, node2Id: string) {
    super(message);
    this.name = "CycleError";
    this.node1Id = node1Id;
    this.node2Id = node2Id;
  }
}

class InputNodeAlreadyConnectedError extends Error {
  node1Id: string;
  node2PortId: string;
  node2Id?: string;

  constructor(
    message: string,
    node1Id: string,
    node2PortId: string,
    node2Id?: string,
  ) {
    super(message);
    this.name = "InputNodeAlreadyConnectedError";
    this.node1Id = node1Id;
    this.node2PortId = node2PortId;
    this.node2Id = node2Id;
  }
}

class InputPortFullError extends Error {
  portId: string;
  nodeId?: string;

  constructor(message: string, portId: string, nodeId?: string) {
    super(message);
    this.name = "InputPortFullError";
    this.portId = portId;
    this.nodeId = nodeId;
  }
}

export { CycleError, InputNodeAlreadyConnectedError, InputPortFullError };
