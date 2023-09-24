import { Box, Link, Typography } from "@mui/material";
import { type FunctionComponent } from "react";
import type MathLabelPartType from "../features/MathLabelPartType";
import Katex from "../latex/Katex";

interface MathLabelProps {
  parts: MathLabelPartType[];
  onClickLatexLink: (nodeId: string) => void;
}

const MathLabel: FunctionComponent<MathLabelProps> = ({
  parts,
  onClickLatexLink,
}) => {
  return (
    <Box>
      {parts.map((part) => {
        switch (part.type) {
          case "text": {
            return (
              <Typography key={part.id} display="inline" variant="body2">
                {part.text}
              </Typography>
            );
          }
          case "latex": {
            return <Katex key={part.id} latex={part.latex} />;
          }
          case "latexLink": {
            return (
              <Link
                key={part.id}
                href="#"
                onClick={() => {
                  onClickLatexLink(part.href);
                }}
              >
                <Katex latex={part.latex} />
              </Link>
            );
          }
          default: {
            throw new Error("Unknown description part type");
          }
        }
      })}
    </Box>
  );
};

export default MathLabel;
