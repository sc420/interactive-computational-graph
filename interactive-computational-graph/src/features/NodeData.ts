import type FeatureNodeType from "./FeatureNodeType";
import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";
import {
  type BodyClickCallback,
  type DerivativeClickCallback,
  type InputChangeCallback,
} from "./ReactNodeCallbacks";

interface NodeData {
  name: string;
  featureNodeType: FeatureNodeType;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onInputChange: InputChangeCallback;
  onBodyClick: BodyClickCallback;
  onDerivativeClick: DerivativeClickCallback;
  isDarkMode: boolean;
  isHighlighted: boolean;
}

export default NodeData;
