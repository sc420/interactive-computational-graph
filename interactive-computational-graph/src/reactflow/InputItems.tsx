import { Box, Grid, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position } from "reactflow";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  data: NodeData;
}

const handleSize = 20;
const itemHeight = 40;
const inputWidth = 120;

const InputItems: FunctionComponent<InputItemProps> = ({ data }) => {
  const theme = useTheme();

  const getInputPortInputId = useCallback(
    (reactFlowId: string, portId: string): string => {
      return `node-input-${reactFlowId}-${portId}`;
    },
    [],
  );

  const getInputHandleLeft = useCallback((): string => {
    const contentSpacing = theme.spacing(1);
    return `calc(-1 * (${contentSpacing} + ${handleSize}px))`;
  }, []);

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Input handles */}
      <Grid item xs>
        {data.inputPorts.map((portData) => (
          <Box
            key={portData.id}
            display="flex"
            alignItems="center"
            position="relative"
            height={itemHeight}
          >
            <Handle
              id={portData.id}
              position={Position.Left}
              style={{
                position: "absolute",
                background: theme.palette.grey[700],
                borderRadius: "10px 0px 0px 10px",
                top: 20,
                left: getInputHandleLeft(),
                width: handleSize,
                height: handleSize,
                zIndex: -1,
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
      {/* Input default values */}
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
              defaultValue={portData.defaultValue}
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
