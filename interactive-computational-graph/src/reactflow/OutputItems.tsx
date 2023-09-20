import { Box, Grid, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type NodeData from "../features/NodeData";
import type OutputItemType from "../features/OutputItemType";

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
    (type: OutputItemType): string => {
      return `output-item-${id}-${type}`;
    },
    [id],
  );

  return (
    <Grid container columnSpacing={1} wrap="nowrap">
      {/* Handles and labels */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.type}
            display="flex"
            justifyContent="left"
            alignItems="center"
            height={itemHeight}
          >
            {/* Label */}
            <InputLabel
              data-testid={`label-${getOutputId(item.type)}`}
              htmlFor={getOutputId(item.type)}
            >
              {item.text}
            </InputLabel>
          </Box>
        ))}
      </Grid>

      {/* Outputs */}
      <Grid item xs>
        {data.outputItems.map((item) => (
          <Box
            key={item.type}
            display="flex"
            justifyContent="right"
            alignItems="center"
            height={itemHeight}
          >
            {/* Output */}
            <OutlinedInput
              id={getOutputId(item.type)}
              data-testid={getOutputId(item.type)}
              readOnly={true}
              value={item.value}
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
