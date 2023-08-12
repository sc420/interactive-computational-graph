import { Box, Stack, useTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";
import InputItems from "./InputItems";
import NodeTitle from "./NodeTitle";
import OutputHandle from "./OutputHandle";
import OutputItems from "./OutputItems";
import { bodyPadding, handleSize, inputWidth, itemHeight } from "./styles";

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

const CustomNode: FunctionComponent<CustomNodeProps> = ({ data }) => {
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
              p={bodyPadding}
              spacing={1}
            >
              <InputItems
                data={data}
                itemHeight={itemHeight}
                inputWidth={inputWidth}
                handleLeftOffset={`-${theme.spacing(bodyPadding)}`}
                handleSize={handleSize}
              />
            </Stack>

            {/* Output items */}
            <Stack p={bodyPadding} spacing={1}>
              <OutputItems
                itemHeight={itemHeight}
                inputWidth={inputWidth}
                data={data}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Output handle */}
      <OutputHandle handleSize={handleSize} />
    </>
  );
};

export default CustomNode;
