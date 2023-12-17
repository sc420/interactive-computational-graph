import { Editor } from "@monaco-editor/react";
import { Box } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type MonacoEditorProps from "./MonacoEditorProps";

const MonacoEditor: FunctionComponent<MonacoEditorProps> = ({
  defaultValue,
  defaultLanguage,
  value,
  isDarkMode,
  readOnly,
  onChange,
}) => {
  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) {
        return;
      }
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <Box border={1} borderColor="grey.500">
      <Editor
        height="300px"
        defaultValue={defaultValue}
        defaultLanguage={defaultLanguage}
        value={value}
        theme={isDarkMode ? "vs-dark" : "light"}
        options={{
          readOnly,
        }}
        onChange={handleChange}
      />
    </Box>
  );
};

export default MonacoEditor;
