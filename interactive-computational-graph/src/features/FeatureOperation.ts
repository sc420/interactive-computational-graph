import type Operation from "../graph/Operation";
import type Port from "../graph/Port";
import type OperationType from "./OperationType";

interface FeatureOperation {
  id: string;
  text: string;
  type: OperationType;
  // Core operation
  operation: Operation;
  // List of input ports
  inputPorts: Port[];
  // Help text written in Markdown
  helpText: string;
}

export default FeatureOperation;
