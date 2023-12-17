import { Box, TextField } from "@mui/material";
import { type FunctionComponent } from "react";
import type MonacoEditorProps from "../MonacoEditorProps";

const MockMonacoEditor: FunctionComponent<MonacoEditorProps> = ({
  testId,
  value,
  onChange,
}) => {
  return (
    <Box border={1}>
      <TextField
        inputProps={{
          "data-testid": testId,
        }}
        size="small"
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      />
    </Box>
  );
};

export default MockMonacoEditor;
