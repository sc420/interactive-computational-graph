import type FeatureNodeType from "./FeatureNodeType";
import type InputItem from "./InputItem";
import type OperationNodeData from "./OperationNodeData";
import type OutputItem from "./OutputItem";
import {
  type BodyClickCallback,
  type DerivativeClickCallback,
  type InputChangeCallback,
  type NameChangeCallback,
} from "./ReactNodeCallbacks";

interface NodeData {
  name: string;
  operationData: OperationNodeData | null;
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
