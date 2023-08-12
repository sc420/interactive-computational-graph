import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  id: string;
  text: string;
  nodeType: string;
  inputItems: InputItem[];
  outputItems: OutputItem[];
}

export default NodeData;
