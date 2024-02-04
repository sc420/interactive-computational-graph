import { Button, Stack, Typography } from "@mui/material";
import { saveAs } from "file-saver";
import {
  useCallback,
  useRef,
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
          console.log(data);
          onLoad(data);
        } catch (error) {
          console.error(error);
          // TODO(sc420): Show an alert
        }
      };
      reader.onerror = () => {
        console.error(reader.error);
        // TODO(sc420): Show an alert
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

      {/* Buttons */}
      <Stack px={2} py={1} spacing={3}>
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
      </Stack>

      {/* Input to load file */}
      <input
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
