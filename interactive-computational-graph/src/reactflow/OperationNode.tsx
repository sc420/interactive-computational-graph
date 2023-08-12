import { Box, Stack, useTheme } from "@mui/material";
import { type FunctionComponent } from "react";
import { type NodeProps } from "reactflow";
import type NodeData from "../features/NodeData";
import InputItems from "./InputItems";
import NodeTitle from "./NodeTitle";
import OutputHandle from "./OutputHandle";
import { blue } from "@mui/material/colors";

interface OperationNodeProps extends NodeProps {
  data: NodeData;
}

const handleSize = 20;
const contentPadding = 1;

const OperationNode: FunctionComponent<OperationNodeProps> = ({ data }) => {
  const theme = useTheme();

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
          <NodeTitle graphId={data.graphId} backgroundColor={blue[300]} />

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
