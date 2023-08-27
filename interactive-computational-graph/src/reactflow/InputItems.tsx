import { Box, Grid, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  id: string;
  data: NodeData;
  itemHeight: number;
  inputWidth: number;
  // If we don't offset the handle, the handle would align its left edge with
  // the left edge of the input label
  handleLeftOffset: string;
  handleSize: number;
  handleColor: string;
  handleHoverColor: string;
  onInputChange: (inputPortId: string, value: string) => void;
}

const InputItems: FunctionComponent<InputItemProps> = ({
  id,
  data,
  itemHeight,
  inputWidth,
  handleLeftOffset,
  handleSize,
  handleColor,
  handleHoverColor,
  onInputChange,
}) => {
  const getInputId = useCallback(
    (portId: string): string => {
      return `input-item-${id}-${portId}`;
    },
    [id],
  );

  const getInputHandleLeft = useCallback((): string => {
    return `calc(-1 * ${handleSize}px + ${handleLeftOffset})`;
  }, [handleLeftOffset, handleSize]);

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Handles and labels */}
      <Grid item xs>
        {data.inputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="left"
            alignItems="center"
            position="relative" // for Handle
            height={itemHeight}
          >
            {/* Handle */}
            {item.showHandle && (
              <Box
                sx={{
                  "& .react-flow__handle:hover": {
                    backgroundColor: `${handleHoverColor} !important`,
                  },
                }}
              >
                <Handle
                  id={item.id}
                  position={Position.Left}
                  style={{
                    position: "absolute", // needs position="relative" on parent
                    background: handleColor,
                    borderRadius: "10px 0px 0px 10px",
                    top: 20, // manual offset
                    left: getInputHandleLeft(),
                    width: handleSize,
                    height: handleSize,
                    zIndex: -1, // shows under the node body
                  }}
                  type="target"
                />
              </Box>
            )}

            {/* Label */}
            <InputLabel htmlFor={getInputId(item.id)}>{item.text}</InputLabel>
          </Box>
        ))}
      </Grid>

      {/* Inputs */}
      <Grid item xs>
        {data.inputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="right"
            alignItems="center"
            height={itemHeight}
          >
            {/* Input */}
            {item.showInputField && (
              <OutlinedInput
                id={getInputId(item.id)}
                data-testid={getInputId(item.id)}
                defaultValue={item.value}
                size="small"
                inputProps={{
                  style: {
                    padding: "4px 8px",
                    textAlign: "right",
                    width: inputWidth,
                  },
                }}
                onChange={(event) => {
                  onInputChange(item.id, event.target.value);
                }}
              ></OutlinedInput>
            )}
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default InputItems;
