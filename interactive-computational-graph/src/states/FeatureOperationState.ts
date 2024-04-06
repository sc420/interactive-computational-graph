import type OperationType from "../features/OperationType";
import type CoreOperationState from "./CoreOperationState";
import type PortState from "./PortState";

interface FeatureOperation {
  id: string;
  name: string;
  type: OperationType;
  namePrefix: string;
  operation: CoreOperationState;
  inputPorts: PortState[];
  helpText: string;
}

export default FeatureOperation;
