import { type FunctionComponent } from "react";
import type KatexProps from "../KatexProps";

const MockKatex: FunctionComponent<KatexProps> = ({ latex }) => {
  return <span>{latex}</span>;
};

export default MockKatex;
