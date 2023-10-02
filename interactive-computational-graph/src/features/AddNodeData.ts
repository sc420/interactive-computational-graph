import type FeatureNodeType from "./FeatureNodeType";
import type FeatureOperation from "./FeatureOperation";
import {
  type BodyClickCallback,
  type DerivativeClickCallback,
  type InputChangeCallback,
  type NameChangeCallback,
} from "./ReactNodeCallbacks";

interface AddNodeData {
  featureNodeType: FeatureNodeType;
  nodeId: string;
  featureOperations: FeatureOperation[];
  isReverseMode: boolean;
  derivativeTarget: string | null;
  onNameChange: NameChangeCallback;
  onInputChange: InputChangeCallback;
  onBodyClick: BodyClickCallback;
  onDerivativeClick: DerivativeClickCallback;
  isDarkMode: boolean;
}

export default AddNodeData;
