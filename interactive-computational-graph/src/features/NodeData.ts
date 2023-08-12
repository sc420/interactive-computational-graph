import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  graphId: string;
  reactFlowId: string;
  inputItems: InputItem[];
  outputItems: OutputItem[];
}

export default NodeData;
