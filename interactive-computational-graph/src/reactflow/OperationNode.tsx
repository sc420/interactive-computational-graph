import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";
import InputItems from "./InputItems";
import OutputHandle from "./OutputHandle";

interface OperationNodeProps extends NodeProps {
  data: NodeData;
}

const handleSize = 20;
const idFontSize = 14;
const contentPadding = 1;

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
          <Stack sx={{ cursor: "default" }} p={contentPadding} spacing={0.5}>
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

            {/* Input items */}
            <InputItems
              data={data}
              handleLeft={theme.spacing(contentPadding)}
              handleSize={handleSize}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Output handle */}
      <OutputHandle handleSize={handleSize} />
    </>
  );
};

export default OperationNode;
