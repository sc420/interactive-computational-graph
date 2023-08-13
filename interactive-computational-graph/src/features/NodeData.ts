import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  text: string;
  nodeType: string;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onBodyClick: (id: string) => void;
}

export default NodeData;
