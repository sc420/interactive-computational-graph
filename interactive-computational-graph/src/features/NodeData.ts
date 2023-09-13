import type FeatureNodeType from "./FeatureNodeType";
import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";
import {
  type BodyClickCallback,
  type InputChangeCallback,
} from "./ReactNodeCallbacks";

interface NodeData {
  text: string;
  featureNodeType: FeatureNodeType;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onInputChange: InputChangeCallback;
  onBodyClick: BodyClickCallback;
  isDarkMode: boolean;
  isHighlighted: boolean;
}

export default NodeData;
