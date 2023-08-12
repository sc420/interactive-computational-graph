import { Box, Grid, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  data: NodeData;
  // left position of the handle in the node body, used to offset the absolute
  // positioned handle
  handleLeft: string;
  handleSize: number;
}

const itemHeight = 40;
const inputWidth = 120;

const InputItems: FunctionComponent<InputItemProps> = ({
  data,
  handleLeft,
  handleSize,
}) => {
  const theme = useTheme();

  const getInputPortInputId = useCallback(
    (reactFlowId: string, portId: string): string => {
      return `node-input-${reactFlowId}-${portId}`;
    },
    [],
  );

  const getInputHandleLeft = useCallback((): string => {
    return `calc(-1 * (${handleLeft} + ${handleSize}px))`;
  }, [handleLeft]);

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Input handles */}
      <Grid item xs>
        {data.inputPorts.map((portData) => (
          <Box
            key={portData.id}
            display="flex"
            alignItems="center"
            position="relative" // for Handle
            height={itemHeight}
          >
            <Handle
              id={portData.id}
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
            <InputLabel
              htmlFor={getInputPortInputId(data.reactFlowId, portData.id)}
            >
              {portData.id}
            </InputLabel>
          </Box>
        ))}
      </Grid>
      {/* Input values */}
      <Grid item xs>
        {data.inputPorts.map((portData) => (
          <Box
            key={portData.id}
            display="flex"
            alignItems="center"
            height={itemHeight}
          >
            <OutlinedInput
              id={getInputPortInputId(data.reactFlowId, portData.id)}
              disabled={portData.connected}
              defaultValue={portData.value}
              size="small"
              inputProps={{
                style: {
                  padding: "4px 8px",
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
