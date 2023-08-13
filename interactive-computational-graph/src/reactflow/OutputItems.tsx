import { Box, Grid, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type NodeData from "../features/NodeData";

interface InputItemProps {
  id: string;
  data: NodeData;
  itemHeight: number;
  inputWidth: number;
}

const InputItems: FunctionComponent<InputItemProps> = ({
  id,
  data,
  itemHeight,
  inputWidth,
}) => {
  const getOutputId = useCallback(
    (portId: string): string => {
      return `output-item-${id}-${portId}`;
    },
    [id],
  );

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Handles and labels */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="left"
            alignItems="center"
            height={itemHeight}
          >
            {/* Label */}
            <InputLabel htmlFor={getOutputId(item.id)}>{item.text}</InputLabel>
          </Box>
        ))}
      </Grid>

      {/* Outputs */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="right"
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
