import { type FunctionComponent } from "react";
import type KatexProps from "../KatexProps";

const KatexMock: FunctionComponent<KatexProps> = ({ latex }) => {
  return <span>{latex}</span>;
};

export default KatexMock;
