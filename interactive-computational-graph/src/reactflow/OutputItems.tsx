import { Box, Grid, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  data: NodeData;
}

const itemHeight = 40;
const inputWidth = 120;

const InputItems: FunctionComponent<InputItemProps> = ({ data }) => {
  const getOutputId = useCallback(
    (portId: string): string => {
      return `output-item-${data.reactFlowId}-${portId}`;
    },
    [data],
  );

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Handles and labels */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            height={itemHeight}
          >
            {/* Label */}
            <InputLabel htmlFor={getOutputId(item.id)}>{item.id}</InputLabel>
          </Box>
        ))}
      </Grid>

      {/* Outputs */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            height={itemHeight}
          >
            {/* Output */}
            <OutlinedInput
              id={getOutputId(item.id)}
              readOnly={true}
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
