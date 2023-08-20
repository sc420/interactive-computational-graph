import type FeatureNodeType from "./FeatureNodeType";
import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";

interface NodeData {
  text: string;
  featureNodeType: FeatureNodeType;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onInputChange: (nodeId: string, inputPortId: string, value: string) => void;
  onBodyClick: (nodeId: string) => void;
}

export default NodeData;
