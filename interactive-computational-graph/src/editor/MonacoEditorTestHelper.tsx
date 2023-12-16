import { Box, TextField } from "@mui/material";
import { type FunctionComponent } from "react";

interface MonacoEditorTestHelperProps {
  testId: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const MonacoEditorTestHelper: FunctionComponent<
  MonacoEditorTestHelperProps
> = ({ testId, value, onChange }) => {
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

export default MonacoEditorTestHelper;
