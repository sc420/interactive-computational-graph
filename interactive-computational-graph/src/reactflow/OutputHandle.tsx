import { Box } from "@mui/material";
import { type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";

interface OutputHandleProps {
  handleSize: number;
  handleColor: string;
  handleHoverColor: string;
  handleBorderColor: string;
}

const OutputHandle: FunctionComponent<OutputHandleProps> = ({
  handleSize,
  handleColor,
  handleHoverColor,
  handleBorderColor,
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
          borderColor: handleBorderColor,
          borderRadius: "0px 15px 15px 0px",
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
