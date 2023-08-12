import { Box } from "@mui/material";
import { type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";

interface OutputHandleProps {
  handleSize: number;
  handleColor: string;
  handleHoverColor: string;
}

const OutputHandle: FunctionComponent<OutputHandleProps> = ({
  handleSize,
  handleColor,
  handleHoverColor,
}) => {
  return (
    <Box
      sx={{
        "& .react-flow__handle:hover": {
          backgroundColor: `${handleHoverColor} !important`,
        },
      }}
    >
      <Handle
        id="output"
        position={Position.Right}
        style={{
          background: handleColor,
          borderRadius: "0px 10px 10px 0px",
          top: "50%", // centers the handle
          // adds 1 to hide the tiny gap between the node body and the handle
          right: -handleSize + 1,
          width: handleSize,
          height: "100%",
          zIndex: -1, // shows under the node body
        }}
        type="source"
      />
    </Box>
  );
};

export default OutputHandle;
