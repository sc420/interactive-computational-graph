import { Box, Grid, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  data: NodeData;
  itemHeight: number;
  inputWidth: number;
  // If we don't offset the handle, the handle would align its left edge with
  // the left edge of the input label
  handleLeftOffset: string;
  handleSize: number;
}

const InputItems: FunctionComponent<InputItemProps> = ({
  data,
  itemHeight,
  inputWidth,
  handleLeftOffset,
  handleSize,
}) => {
  const theme = useTheme();

  const getInputId = useCallback(
    (portId: string): string => {
      return `input-item-${data.id}-${portId}`;
    },
    [data],
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
            alignItems="center"
            position="relative" // for Handle
            height={itemHeight}
          >
            {/* Handle */}
            {item.showHandle && (
              <Box
                sx={{
                  "& .react-flow__handle:hover": {
                    backgroundColor: `${theme.palette.grey[300]} !important`,
                  },
                }}
              >
                <Handle
                  id={item.id}
                  position={Position.Left}
                  style={{
                    position: "absolute", // needs position="relative" on parent
                    background: theme.palette.grey[500],
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
            alignItems="center"
            height={itemHeight}
          >
            {/* Input */}
            <OutlinedInput
              id={getInputId(item.id)}
              readOnly={item.readOnly}
              defaultValue={item.value}
              size="small"
              inputProps={{
                style: {
                  padding: "4px 8px",
                  textAlign: "right",
                  width: inputWidth,
                },
              }}
            ></OutlinedInput>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default InputItems;
