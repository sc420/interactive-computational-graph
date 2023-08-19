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
  id: string;
  data: NodeData;
  selected: boolean;
}

const CustomNode: FunctionComponent<CustomNodeProps> = ({
  id,
  data,
  selected,
}) => {
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

  const handleInputChange = useCallback(
    (inputPortId: string, value: string): void => {
      data.onInputChange(id, inputPortId, value);
    },
    [id, data],
  );

  const handleBodyClick = useCallback((): void => {
    data.onBodyClick(id);
  }, [id, data]);

  // Set colors
  const colorTheme = getColorTheme();
  const borderColor = selected ? colorTheme[800] : colorTheme[200];
  const titleColor = selected ? colorTheme[300] : colorTheme[200];
  const handleColor = titleColor;
  const handleHoverColor = selected ? colorTheme[200] : colorTheme[100];

  return (
    <>
      {/* Node frame */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor={borderColor}
        borderRadius={1}
      >
        <Stack>
          {/* Header */}
          <NodeTitle text={data.text} backgroundColor={titleColor} />

          {/* Body */}
          <Box onClick={handleBodyClick} sx={{ cursor: "default" }}>
            {/* Input items */}
            {data.inputItems.length > 0 && (
              <Box borderTop={1} borderColor="divider" p={bodyPadding}>
                <InputItems
                  id={id}
                  data={data}
                  itemHeight={itemHeight}
                  inputWidth={inputWidth}
                  handleLeftOffset={`-${theme.spacing(bodyPadding)}`}
                  handleSize={handleSize}
                  handleColor={handleColor}
                  handleHoverColor={handleHoverColor}
                  onInputChange={handleInputChange}
                />
              </Box>
            )}

            {/* Output items */}
            {data.outputItems.length > 0 && (
              <Box borderTop={1} borderColor="divider" p={bodyPadding}>
                <OutputItems
                  id={id}
                  itemHeight={itemHeight}
                  inputWidth={inputWidth}
                  data={data}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Output handle */}
      <OutputHandle
        handleSize={handleSize}
        handleColor={handleColor}
        handleHoverColor={handleHoverColor}
      />
    </>
  );
};

export default CustomNode;
