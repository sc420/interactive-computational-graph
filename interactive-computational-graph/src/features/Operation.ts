import type OperationType from "./OperationType";

interface Operation {
  id: string;
  text: string;
  type: OperationType;
  // f() code
  fCode: string;
  // d(f)/d(y) code
  dfdyCode: string;
  // List of input port names
  inputPorts: string[];
  // Help text written in Markdown
  helpText: string;
}

export default Operation;
