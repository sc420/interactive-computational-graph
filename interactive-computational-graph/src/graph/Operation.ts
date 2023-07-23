import { type NodeData, type PortToNodesData } from "./PortToNodesData";

class Operation {
  static readonly F_FN_NAME = "f";

  static readonly DFDY_FN_NAME = "dfdy";

  private readonly fCode: string;

  private readonly dfdyCode: string;

  constructor(fCode: string, dfdyCode: string) {
    this.fCode = fCode;
    this.dfdyCode = dfdyCode;
  }

  evalF(portToNodesData: PortToNodesData): number {
    const arg1 = JSON.stringify(portToNodesData);
    const args: string[] = [arg1];
    return Operation.evalCode(this.fCode, Operation.F_FN_NAME, args);
  }

  evalDfdy(portToNodesData: PortToNodesData, yNodeData: NodeData): number {
    const arg1 = JSON.stringify(portToNodesData);
    const arg2 = JSON.stringify(yNodeData);
    const args: string[] = [arg1, arg2];
    return Operation.evalCode(this.dfdyCode, Operation.DFDY_FN_NAME, args);
  }

  private static evalCode(
    code: string,
    fnName: string,
    args: string[],
  ): number {
    const argsSeparatedByComma = args.join(", ");
    const fullCode = `\
${code}
${fnName}(${argsSeparatedByComma})
`;
    try {
      // eslint-disable-next-line no-eval
      const result = eval(fullCode);
      if (typeof result !== "number") {
        throw new Error(
          `The eval result should be number, but got type ${typeof result}`,
        );
      }
      return result;
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }

      console.error(
        `Error occurred when running eval with the user code: ${error.message}`,
      );
      console.error(
        `Please make sure the following code is executable:\n${fullCode}`,
      );
      console.error(
        `Stack trace:\n${error.stack?.toString() ?? "Unavailable"}`,
      );
      throw error;
    }
  }
}

export default Operation;
