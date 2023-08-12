import { Box, Grid, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  data: NodeData;
  handleLeftOffset: string;
  handleSize: number;
}

const itemHeight = 40;
const inputWidth = 120;

const InputItems: FunctionComponent<InputItemProps> = ({
  data,
  handleLeftOffset,
  handleSize,
}) => {
  const theme = useTheme();

  const getInputId = useCallback(
    (portId: string): string => {
      return `input-item-${data.reactFlowId}-${portId}`;
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
              <Handle
                id={item.id}
                position={Position.Left}
                style={{
                  position: "absolute", // needs position="relative" on parent
                  background: theme.palette.grey[700],
                  borderRadius: "10px 0px 0px 10px",
                  top: 20, // manual offset
                  left: getInputHandleLeft(),
                  width: handleSize,
                  height: handleSize,
                  zIndex: -1, // shows under the node body
                }}
                type="target"
              />
            )}

            {/* Label */}
            <InputLabel htmlFor={getInputId(item.id)}>{item.id}</InputLabel>
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
