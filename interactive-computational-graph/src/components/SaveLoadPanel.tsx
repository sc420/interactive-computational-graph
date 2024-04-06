import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type FunctionComponent,
} from "react";
import type GraphContainerState from "../states/GraphContainerState";

interface SaveLoadPanelProps {
  onSave: () => GraphContainerState;
  onLoad: (graphContainerState: GraphContainerState) => void;
}

const SaveLoadPanel: FunctionComponent<SaveLoadPanelProps> = ({
  onSave,
  onLoad,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoadingSuccess, setLoadingSuccess] = useState(false);
  const [isLoadingError, setLoadingError] = useState(false);

  const handleSave = useCallback(() => {
    const data = onSave();
    const serializedData = JSON.stringify(data, null, 4);
    const blob = new Blob([serializedData], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "graph.json");
  }, [onSave]);

  const handleLoad = useCallback(() => {
    if (inputRef.current === null) {
      return;
    }
    inputRef.current.click();
  }, []);

  const loadFile = useCallback(
    (file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        const serializedData = reader.result;
        if (typeof serializedData !== "string") {
          return;
        }

        try {
          const data = JSON.parse(serializedData) as GraphContainerState;
          setLoadingSuccess(true);
          setLoadingError(false);
          onLoad(data);
        } catch (error) {
          console.error(error);
          setLoadingSuccess(false);
          setLoadingError(true);
        }
      };

      reader.onerror = () => {
        console.error(reader.error);
        setLoadingSuccess(false);
        setLoadingError(true);
      };

      reader.readAsText(file);
    },
    [onLoad],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files == null || files.length === 0) {
        return;
      }
      const file = files[0];
      loadFile(file);
    },
    [loadFile],
  );

  return (
    <>
      {/* Header and toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={0.5}
      >
        <Typography variant="subtitle1">Save/Load</Typography>
      </Stack>

      {/* Contents */}
      <Stack px={2} py={1} spacing={3}>
        {/* Buttons */}
        <Button
          variant="contained"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleLoad();
          }}
        >
          Load
        </Button>

        {/* Help text */}
        <section>
          <Typography variant="subtitle2" gutterBottom>
            What Will Be Saved/Loaded
          </Typography>
          <List
            dense
            disablePadding
            component="ul"
            sx={{ listStyle: "disc", pl: 3 }}
          >
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Nodes and connections" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Operations" />
            </ListItem>
            <ListItem disablePadding sx={{ display: "list-item" }}>
              <ListItemText primary="Toolbar status" />
            </ListItem>
          </List>
        </section>

        {/* Successful message for loading */}
        {isLoadingSuccess && (
          <Alert severity="success">
            The file has been loaded successfully.
          </Alert>
        )}

        {/* Error message for loading */}
        {isLoadingError && (
          <Alert severity="error">
            An error has occurred while loading the file. See the developer
            console for details.
          </Alert>
        )}
      </Stack>

      {/* Input to load file */}
      <input
        aria-label="Load file"
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        value="" // avoid no change on second click with the same file
      />
    </>
  );
};

export default SaveLoadPanel;
