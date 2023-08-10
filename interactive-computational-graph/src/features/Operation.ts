import type OperationCategory from "./OperationCategory";

interface Operation {
  id: string;
  category: OperationCategory;
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
