import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface OperationNodeProps extends NodeProps {
  data: {
    inputPorts: string[];
  };
}

/* Shape sizes */
const minNodeHeight = 140;
const textFieldWidth = 120;
const inputPortMargin = 10;
const defaultHandleSize = 20;
const handlePadding = 8;
/* Font sizes */
const idFontSize = 14;
const textFieldFontSize = 14;
const inputPortFontSize = 12;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const theme = useTheme();

  const getHeight = useCallback((numInputPorts: number): number => {
    // height is divided by (numInputPorts + 1) gaps
    const inputPortHeight = (data.inputPorts.length + 1) * inputPortMargin;
    return Math.max(minNodeHeight, inputPortHeight);
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
      {/* Node body */}
      <Box
        bgcolor="background.default"
        border={1}
        borderColor="primary"
        borderRadius={1}
      >
        <Stack height={getHeight(data.inputPorts.length)}>
          {/* Title */}
          <Box borderBottom={1} borderColor="divider" px={1}>
            <Grid alignItems="center" container justifyContent="space-between">
              <Grid item>
                <Box display="flex" alignItems="center">
                  <DragIndicatorIcon fontSize="small" />
                  <Typography fontSize={idFontSize}>Sum</Typography>
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
          <Stack p={1} spacing={1}>
            <TextField
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
            />
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
        {data.inputPorts.map((portName, index) => (
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
        ))}

        {/* Output port */}
        <Handle
          id="output"
          position={Position.Right}
          style={{
            background: theme.palette.grey[700],
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
      </Box>
    </>
  );
};

export default OperationNode;
