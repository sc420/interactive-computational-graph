import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";

interface OperationNodeProps extends NodeProps {
  data: NodeData;
}

/* Shape sizes */
// const minNodeHeight = 300;
// const textFieldWidth = 120;
// const inputPortMargin = 10;
const defaultHandleSize = 20;
const handlePadding = 8;
const inputPortItemHeight = 40;
/* Font sizes */
const idFontSize = 14;
// const textFieldFontSize = 14;
// const inputPortIdFontSize = 14;
// const inputPortFontSize = 12;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const theme = useTheme();

  // const getHeight = useCallback((numInputPorts: number): number => {
  //   // height is divided by (numInputPorts + 1) gaps
  //   const inputPortHeight = (data.inputPorts.length + 1) * inputPortMargin;
  //   return Math.max(minNodeHeight, inputPortHeight);
  // }, []);

  // const getHandleTop = useCallback(
  //   (index: number, numInputPorts: number): string => {
  //     // height is divided by (numInputPorts + 1) gaps
  //     // port is located at the bottom of the index-th gap
  //     const percentage = ((index + 1) / (numInputPorts + 1)) * 100;
  //     return `${percentage}%`;
  //   },
  //   [],
  // );

  // const getHandleWidth = useCallback((portName: string): number => {
  //   return 16 + measureTextWidth(portName);
  // }, []);

  // const measureTextWidth = useCallback((text: string): number => {
  //   const dummyElement = document.createElement("div");
  //   dummyElement.style.visibility = "hidden";
  //   dummyElement.style.position = "absolute";
  //   dummyElement.style.whiteSpace = "nowrap";
  //   dummyElement.innerText = text;
  //   document.body.appendChild(dummyElement);

  //   const width = dummyElement.getBoundingClientRect().width;
  //   document.body.removeChild(dummyElement);

  //   return width;
  // }, []);

  const getInputPortInputId = useCallback(
    (reactFlowId: string, portId: string): string => {
      return `node-input-${reactFlowId}-${portId}`;
    },
    [],
  );

  const getInputHandleLeft = useCallback((): string => {
    const contentSpacing = theme.spacing(1);
    return `calc(-1 * (${contentSpacing} + ${defaultHandleSize}px))`;
  }, []);

  return (
    <>
      {/* Node body */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor="primary"
        borderRadius={1}
      >
        <Stack>
          {/* Title */}
          <Box
            borderBottom={1}
            borderColor="divider"
            // corresponds to dragHandle when creating new reactflow.Node
            className="drag-handle"
            sx={{
              bgcolor: blue[300],
            }}
            px={0.5}
          >
            <Grid alignItems="center" container justifyContent="space-between">
              <Grid item>
                <Box display="flex" alignItems="center">
                  <DragIndicatorIcon fontSize="small" />
                  <Typography fontSize={idFontSize} fontWeight={500}>
                    {data.graphId}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {/* Content */}
          <Stack sx={{ cursor: "default" }} p={1} spacing={0.5}>
            {/* <TextField
              InputLabelProps={{ style: { fontSize: textFieldFontSize } }}
              InputProps={{
                style: { fontSize: textFieldFontSize },
              }}
              defaultValue="0"
              label="Value"
              size="small"
              sx={{
                width: textFieldWidth,
              }}
              variant="standard"
            />
            <TextField
              InputLabelProps={{ style: { fontSize: textFieldFontSize } }}
              InputProps={{
                readOnly: true,
                style: { fontSize: textFieldFontSize },
              }}
              defaultValue="0"
              label="Derivative"
              size="small"
              sx={{
                width: textFieldWidth,
              }}
              variant="standard"
            /> */}

            {/* Input port items */}
            <Grid container columnSpacing={1} wrap="nowrap">
              {/* Input handles */}
              <Grid item xs>
                {data.inputPorts.map((portData) => (
                  <Box
                    key={portData.id}
                    display="flex"
                    alignItems="center"
                    position="relative"
                    height={inputPortItemHeight}
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
                        width: defaultHandleSize,
                        height: defaultHandleSize,
                        zIndex: -1,
                      }}
                      type="target"
                    />
                    <InputLabel
                      htmlFor={getInputPortInputId(
                        data.reactFlowId,
                        portData.id,
                      )}
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
                    height={inputPortItemHeight}
                  >
                    {portData.connected && (
                      <OutlinedInput
                        id={getInputPortInputId(data.reactFlowId, portData.id)}
                        size="small"
                        inputProps={{
                          style: {
                            padding: "4px 8px",
                            width: "120px",
                          },
                        }}
                      ></OutlinedInput>
                    )}
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Box>

      {/* Node handles */}
      <Box
        sx={{
          "& .react-flow__handle:hover": {
            backgroundColor: `${theme.palette.grey[500]} !important`,
          },
        }}
      >
        {/* Input ports */}
        {/* {data.inputPorts.map((portName, index) => (
          <Handle
            id={portName}
            key={portName}
            position={Position.Left}
            style={{
              background: theme.palette.grey[700],
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
            <Typography
              color="primary.contrastText"
              fontSize={inputPortFontSize}
            >
              {portName}
            </Typography>
          </Handle>
        ))} */}

        {/* Output port */}
        <Handle
          id="output"
          position={Position.Right}
          style={{
            background: theme.palette.grey[700],
            borderRadius: "0px 10px 10px 0px",
            top: "50%",
            right: -defaultHandleSize + 1,
            width: defaultHandleSize,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: handlePadding,
          }}
          type="source"
        />
      </Box>
    </>
  );
};

export default OperationNode;
