import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  text: string;
  nodeType: string;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onInputChange: (nodeId: string, inputPortId: string, value: string) => void;
  onBodyClick: (nodeId: string) => void;
}

export default NodeData;
