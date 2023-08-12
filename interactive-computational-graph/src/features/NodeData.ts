import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  text: string;
  nodeType: string;
  inputItems: InputItem[];
  outputItems: OutputItem[];
}

export default NodeData;
