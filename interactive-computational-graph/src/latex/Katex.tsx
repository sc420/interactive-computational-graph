import katex from "katex";
import { useMemo, type FunctionComponent } from "react";
import type KatexProps from "./KatexProps";

const Katex: FunctionComponent<KatexProps> = ({ latex }) => {
  const options = useMemo((): katex.KatexOptions => {
    return {
      output: "mathml",
      throwOnError: false,
    };
  }, []);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, options) }}
    ></span>
  );
};

export default Katex;
