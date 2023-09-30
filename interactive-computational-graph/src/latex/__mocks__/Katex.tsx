import { type FunctionComponent } from "react";

interface KatexProps {
  latex: string;
}

const KatexMock: FunctionComponent<KatexProps> = ({ latex }) => {
  return <span>{latex}</span>;
};

export default KatexMock;
