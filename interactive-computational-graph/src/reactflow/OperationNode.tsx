import { Box, Stack, useTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";
import InputItems from "./InputItems";
import NodeTitle from "./NodeTitle";
import OutputHandle from "./OutputHandle";
import OutputItems from "./OutputItems";

interface OperationNodeProps extends NodeProps {
  data: NodeData;
}

const handleSize = 20;
const contentPadding = 1;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <>
      {/* Node frame */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor="primary"
        borderRadius={1}
      >
        <Stack>
          {/* Header */}
          <NodeTitle graphId={data.graphId} backgroundColor={blue[300]} />

          {/* Body */}
          <Box sx={{ cursor: "default" }}>
            {/* Input items */}
            <Stack
              borderBottom={1}
              borderColor="divider"
              p={contentPadding}
              spacing={1}
            >
              <InputItems
                data={data}
                handleLeftOffset={`-${theme.spacing(contentPadding)}`}
                handleSize={handleSize}
              />
            </Stack>

            {/* Output items */}
            <Stack p={contentPadding} spacing={1}>
              <OutputItems data={data} />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Output handle */}
      <OutputHandle handleSize={handleSize} />
    </>
  );
};

export default OperationNode;
