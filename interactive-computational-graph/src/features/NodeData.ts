import type FeatureNodeType from "./FeatureNodeType";
import type InputItem from "./InputItem";
import type OutputItem from "./OutputItem";
import {
  type BodyClickCallback,
  type DerivativeClickCallback,
  type NameChangeCallback,
  type InputChangeCallback,
} from "./ReactNodeCallbacks";

interface NodeData {
  name: string;
  featureNodeType: FeatureNodeType;
  inputItems: InputItem[];
  outputItems: OutputItem[];
  onNameChange: NameChangeCallback;
  onInputChange: InputChangeCallback;
  onBodyClick: BodyClickCallback;
  onDerivativeClick: DerivativeClickCallback;
  isDarkMode: boolean;
  isHighlighted: boolean;
}

export default NodeData;
