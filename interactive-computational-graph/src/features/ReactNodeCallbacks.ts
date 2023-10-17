type NameChangeCallback = (nodeId: string, name: string) => void;

type InputChangeCallback = (
  nodeId: string,
  inputPortId: string,
  value: string,
) => void;

type BodyClickCallback = (nodeId: string) => void;

type DerivativeClickCallback = (nodeId: string) => void;

export type {
  BodyClickCallback,
  DerivativeClickCallback,
  InputChangeCallback,
  NameChangeCallback,
};
