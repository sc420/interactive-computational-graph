import { Box, useTheme } from "@mui/material";
import { type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";

interface OutputHandleProps {
  handleSize: number;
}

const OutputHandle: FunctionComponent<OutputHandleProps> = ({ handleSize }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        "& .react-flow__handle:hover": {
          backgroundColor: `${theme.palette.grey[300]} !important`,
        },
      }}
    >
      <Handle
        id="output"
        position={Position.Right}
        style={{
          background: theme.palette.grey[500],
          borderRadius: "0px 10px 10px 0px",
          top: "50%", // centers the handle
          // adds 1 to hide the tiny gap between the node body and the handle
          right: -handleSize + 1,
          width: handleSize,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        type="source"
      />
    </Box>
  );
};

export default OutputHandle;
