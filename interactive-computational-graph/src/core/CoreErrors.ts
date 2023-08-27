class CycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CycleError";
  }
}

class InputNodeAlreadyConnectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputNodeAlreadyConnectedError";
  }
}

class InputPortFullError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputPortFullError";
  }
}

export { CycleError, InputNodeAlreadyConnectedError, InputPortFullError };
