import { Box, Stack, TextField, Typography } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface OperationNodeProps extends NodeProps {
  data: {
    inputPorts: string[];
  };
}

const baseHeight = 130;
const inputPortMargin = 10;
const defaultHandleSize = 20;
const handlePadding = 8;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const getHeight = useCallback((numInputPorts: number): number => {
    // height is divided by (numInputPorts + 1) gaps
    const inputPortHeight = (data.inputPorts.length + 1) * inputPortMargin;
    return Math.max(baseHeight, inputPortHeight);
  }, []);

  const getHandleTop = useCallback(
    (index: number, numInputPorts: number): string => {
      // height is divided by (numInputPorts + 1) gaps
      // port is located at the bottom of the index-th gap
      const percentage = ((index + 1) / (numInputPorts + 1)) * 100;
      return `${percentage}%`;
    },
    [],
  );

  const getHandleWidth = useCallback((portName: string): number => {
    return 16 + measureTextWidth(portName);
  }, []);

  const measureTextWidth = useCallback((text: string): number => {
    const dummyElement = document.createElement("div");
    dummyElement.style.visibility = "hidden";
    dummyElement.style.position = "absolute";
    dummyElement.style.whiteSpace = "nowrap";
    dummyElement.innerText = text;
    document.body.appendChild(dummyElement);

    const width = dummyElement.getBoundingClientRect().width;
    document.body.removeChild(dummyElement);

    return width;
  }, []);

  return (
    <>
      <Box
        bgcolor="background.default"
        border={1}
        borderColor="primary"
        borderRadius={1}
      >
        <Stack height={getHeight(data.inputPorts.length)} p={2} spacing={1}>
          <TextField defaultValue="0" fullWidth label="Value" size="small" />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            defaultValue="0"
            fullWidth
            label="Derivative"
            size="small"
            variant="filled"
          />
        </Stack>
      </Box>
      {data.inputPorts.map((portName, index) => (
        <Handle
          id={portName}
          key={portName}
          position={Position.Left}
          style={{
            background: "#555",
            borderRadius: "10px 0px 0px 10px",
            top: getHandleTop(index, data.inputPorts.length),
            left: -getHandleWidth(portName),
            width: getHandleWidth(portName),
            height: defaultHandleSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: handlePadding,
          }}
          type="target"
        >
          <Typography color="primary.contrastText">{portName}</Typography>
        </Handle>
      ))}
      <Handle
        id="output"
        position={Position.Right}
        style={{
          background: "#555",
          borderRadius: "0px 10px 10px 0px",
          top: "50%",
          right: -defaultHandleSize,
          width: defaultHandleSize,
          height: "calc(100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: handlePadding,
        }}
        type="source"
      />
    </>
  );
};

export default OperationNode;
