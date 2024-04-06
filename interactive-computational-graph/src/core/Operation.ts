class Operation {
  static readonly fFnName = "f";

  static readonly dfdxFnName = "dfdx";

  private fCode: string;

  private dfdxCode: string;

  constructor(fCode: string, dfdxCode: string) {
    this.fCode = fCode;
    this.dfdxCode = dfdxCode;
  }

  getFCode(): string {
    return this.fCode;
  }

  getDfdxCode(): string {
    return this.dfdxCode;
  }

  setFCode(fCode: string): void {
    this.fCode = fCode;
  }

  setDfdxCode(dfdxCode: string): void {
    this.dfdxCode = dfdxCode;
  }

  evalF(
    fInputPortToNodes: Record<string, string[]>,
    fInputNodeToValues: Record<string, string>,
  ): string {
    const arg1 = JSON.stringify(fInputPortToNodes);
    const arg2 = JSON.stringify(fInputNodeToValues);
    const args: string[] = [arg1, arg2];
    return Operation.evalCode(this.fCode, Operation.fFnName, args);
  }

  evalDfdx(
    fInputPortToNodes: Record<string, string[]>,
    fInputNodeToValues: Record<string, string>,
    xId: string,
  ): string {
    const arg1 = JSON.stringify(fInputPortToNodes);
    const arg2 = JSON.stringify(fInputNodeToValues);
    const arg3 = JSON.stringify(xId);
    const args: string[] = [arg1, arg2, arg3];
    return Operation.evalCode(this.dfdxCode, Operation.dfdxFnName, args);
  }

  private static evalCode(
    code: string,
    fnName: string,
    args: string[],
  ): string {
    const argsSeparatedByComma = args.join(", ");
    const fullCode = `\
${code}
${fnName}(${argsSeparatedByComma})
`;
    try {
      // eslint-disable-next-line no-eval
      const result = eval(fullCode);
      if (typeof result !== "string") {
        throw new Error(
          `The eval result should be string, but got type ${typeof result}`,
        );
      }
      return result;
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Unknown error type ${typeof error}`);
      }

      const message = `\
Error occurred when running eval with the user code: ${error.message}
Please make sure the following code is executable:\n${fullCode}
Stack trace:\n${error.stack?.toString() ?? "Unavailable"}
`;
      console.error(message);
      throw new Error(message);
    }
  }
}

export default Operation;
