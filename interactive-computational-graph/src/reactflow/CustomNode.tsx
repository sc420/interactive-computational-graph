import { Box, Stack, darken, useTheme } from "@mui/material";
import { blue, green, grey, indigo, lime, teal } from "@mui/material/colors";
import { useCallback, type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
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
    switch (data.featureNodeType.nodeType) {
      case "CONSTANT":
        return data.isDarkMode ? teal : green;
      case "VARIABLE":
        return lime;
      case "OPERATION":
        return data.isDarkMode ? indigo : blue;
    }
  }, [data.featureNodeType.nodeType, data.isDarkMode]);

  const getDarkenCoefficient = useCallback(() => {
    switch (data.featureNodeType.nodeType) {
      case "CONSTANT":
        return 0;
      case "VARIABLE":
        return data.isDarkMode ? 0.25 : 0;
      case "OPERATION":
        return data.isDarkMode ? 0.1 : 0;
    }
  }, [data.featureNodeType.nodeType, data.isDarkMode]);

  const getBackgroundColor = useCallback((): string => {
    return data.isDarkMode ? grey[800] : theme.palette.background.default;
  }, [data.isDarkMode, theme.palette.background.default]);

  const getBorderColor = useCallback((): string => {
    const colorTheme = getColorTheme();
    if (data.isDarkMode) {
      return selected ? colorTheme[200] : colorTheme[800];
    } else {
      return selected ? colorTheme[800] : colorTheme[200];
    }
  }, [data.isDarkMode, getColorTheme, selected]);

  const getTitleColor = useCallback((): string => {
    const colorTheme = getColorTheme();
    if (data.isDarkMode) {
      return selected ? colorTheme[700] : colorTheme[800];
    } else {
      return selected ? colorTheme[300] : colorTheme[200];
    }
  }, [data.isDarkMode, getColorTheme, selected]);

  const getHandleHoverColor = useCallback((): string => {
    const colorTheme = getColorTheme();
    if (data.isDarkMode) {
      return selected ? colorTheme[500] : colorTheme[600];
    } else {
      return selected ? colorTheme[200] : colorTheme[100];
    }
  }, [data.isDarkMode, getColorTheme, selected]);

  const handleNameChange = useCallback(
    (name: string): void => {
      data.onNameChange(id, name);
    },
    [data, id],
  );

  const handleInputChange = useCallback(
    (inputPortId: string, value: string): void => {
      data.onInputChange(id, inputPortId, value);
    },
    [data, id],
  );

  const handleBodyClick = useCallback((): void => {
    data.onBodyClick(id);
  }, [data, id]);

  // Get colors
  const darkenCoefficient = getDarkenCoefficient();
  const backgroundColor = getBackgroundColor();
  const borderColor = darken(getBorderColor(), darkenCoefficient);
  const titleColor = darken(getTitleColor(), darkenCoefficient);
  const handleColor = titleColor;
  const handleHoverColor = darken(getHandleHoverColor(), darkenCoefficient);
  const handleBorderColor = borderColor;

  return (
    <>
      {/* Node frame */}
      <Box
        bgcolor={backgroundColor}
        border={1}
        borderColor={borderColor}
        borderRadius={1}
      >
        <Stack>
          {/* Header */}
          <NodeTitle
            id={id}
            name={data.name}
            operationData={data.operationData}
            backgroundColor={titleColor}
            isDarkMode={data.isDarkMode}
            isHighlighted={data.isHighlighted}
            onNameChange={handleNameChange}
          />

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
                  handleBorderColor={handleBorderColor}
                  onInputChange={handleInputChange}
                />
              </Box>
            )}

            {/* Output items */}
            {data.outputItems.length > 0 && (
              <Box borderTop={1} borderColor="divider" p={bodyPadding}>
                <OutputItems
                  id={id}
                  data={data}
                  itemHeight={itemHeight}
                  inputWidth={inputWidth}
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
        handleBorderColor={handleBorderColor}
      />
    </>
  );
};

export default CustomNode;
