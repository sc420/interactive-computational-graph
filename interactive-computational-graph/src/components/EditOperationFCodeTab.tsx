import { Editor } from "@monaco-editor/react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";

interface EditOperationFCodeTabProps {
  fCode: string;
  isDarkMode: boolean;
  onChangeValues: (fCode: string) => void;
}

const EditOperationFCodeTab: FunctionComponent<EditOperationFCodeTabProps> = ({
  fCode,
  isDarkMode,
  onChangeValues,
}) => {
  const [editingFCode, setEditingFCode] = useState(fCode);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value === undefined) {
      return;
    }
    setEditingFCode(value);
  }, []);

  // Update values when the code changes
  useEffect(() => {
    onChangeValues(editingFCode);
  }, [editingFCode, onChangeValues]);

  return (
    <Container>
      <Stack direction="column" spacing={1}>
        {/* Code */}
        <Typography variant="h6" component="h1">
          Code for calculating f()
        </Typography>
        <Box border={1} borderColor="grey.500">
          <Editor
            height="300px"
            theme={isDarkMode ? "vs-dark" : "light"}
            defaultLanguage="javascript"
            defaultValue={fCode}
            onChange={handleEditorChange}
          />
        </Box>

        {/* Test data */}
        <Typography variant="h6" component="h1">
          Test data
        </Typography>
        <Box border={1} borderColor="grey.500">
          <Editor
            height="200px"
            theme={isDarkMode ? "vs-dark" : "light"}
            defaultLanguage="javascript"
            defaultValue={"TODO"}
          />
        </Box>

        {/* Test buttons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          py={1}
        >
          <Button variant="contained" startIcon={<PlayArrowIcon />}>
            Run Test
          </Button>
          <Button variant="outlined" startIcon={<ShuffleIcon />}>
            Generate Random Data
          </Button>
        </Stack>

        {/* Test result */}
        <Typography variant="h6" component="h1">
          Test result
        </Typography>
        <Box border={1} borderColor="grey.500">
          <Editor
            height="200px"
            theme={isDarkMode ? "vs-dark" : "light"}
            defaultLanguage="javascript"
            defaultValue={"TODO"}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default EditOperationFCodeTab;
