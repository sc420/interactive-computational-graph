type InputChangeCallback = (
  nodeId: string,
  inputPortId: string,
  value: string,
) => void;

type BodyClickCallback = (nodeId: string) => void;

export type { InputChangeCallback, BodyClickCallback };
