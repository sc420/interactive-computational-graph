import { Box, Stack, useTheme } from "@mui/material";
import { blue, green, lime } from "@mui/material/colors";
import { useCallback, type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import { constantType, variableType } from "../features/KnownNodeTypes";
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

  const getColorTheme = useCallback((): Record<string, string> => {
    switch (data.nodeType) {
      case constantType:
        return green;
      case variableType:
        return lime;
      default:
        return blue;
    }
  }, [data]);

  const headerBackgroundColor = getColorTheme();

  return (
    <>
      {/* Node frame */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor={headerBackgroundColor[500]}
        borderRadius={1}
      >
        <Stack>
          {/* Header */}
          <NodeTitle
            text={data.text}
            backgroundColor={headerBackgroundColor[300]}
          />

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
