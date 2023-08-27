import type Operation from "../core/Operation";
import type Port from "../core/Port";
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
