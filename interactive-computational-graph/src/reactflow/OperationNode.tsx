import { Box, Stack, useTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";
import InputHandleItems from "./InputHandleItems";
import NodeTitle from "./NodeTitle";
import OutputHandle from "./OutputHandle";

interface OperationNodeProps extends NodeProps {
  data: NodeData;
}

const handleSize = 20;
const contentPadding = 1;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <>
      {/* Node body */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor="primary"
        borderRadius={1}
      >
        <Stack>
          {/* Title */}
          <NodeTitle graphId={data.graphId} backgroundColor={blue[300]} />

          {/* Content */}
          <Stack sx={{ cursor: "default" }} p={contentPadding} spacing={1}>
            {/* Input handle items */}
            <InputHandleItems
              data={data}
              handleLeftOffset={`-${theme.spacing(contentPadding)}`}
              handleSize={handleSize}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Output handle */}
      <OutputHandle handleSize={handleSize} />
    </>
  );
};

export default OperationNode;
