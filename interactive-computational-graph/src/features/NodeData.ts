import type InputItem from "./InputItem";

interface NodeData {
  graphId: string;
  reactFlowId: string;
  inputItems: InputItem[];
  value: string;
  derivative: string;
}

export default NodeData;
