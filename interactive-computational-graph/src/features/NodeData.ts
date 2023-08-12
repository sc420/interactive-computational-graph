import type PortData from "./PortData";

interface NodeData {
  graphId: string;
  reactFlowId: string;
  inputPorts: PortData[];
}

export default NodeData;
