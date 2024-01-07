import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useState,
  type FunctionComponent,
  type KeyboardEvent,
} from "react";
import type OperationNodeData from "../features/OperationNodeData";
import Katex from "../latex/Katex";

interface EditableNameProps {
  name: string;
  operationData: OperationNodeData | null;
  onNameChange: (name: string) => void;
}

const EditableName: FunctionComponent<EditableNameProps> = ({
  name,
  operationData,
  onNameChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);

  const handleChange = useCallback((name: string) => {
    setEditingName(name);
  }, []);

  const handleSaveName = useCallback(
    (name: string) => {
      onNameChange(name);
      setIsEditing(false);
    },
    [onNameChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onNameChange(editingName);
        setIsEditing(false);
      } else if (e.key === "Escape") {
        setEditingName(name);
        setIsEditing(false);
      }
    },
    [editingName, name, onNameChange],
  );

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {isEditing ? (
        <TextField
          size="small"
          value={editingName}
          onChange={(event) => {
            handleChange(event.target.value);
          }}
          onBlur={(event) => {
            handleSaveName(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <>
          <Stack direction="row" spacing={1}>
            {/* Name */}
            <Katex latex={name} />

            {/* Operation data */}
            {operationData !== null && (
              <Tooltip
                title={operationData.helpText}
                placement="top"
                enterDelay={500}
                arrow
              >
                <Typography>({operationData.text})</Typography>
              </Tooltip>
            )}
          </Stack>

          {/* Edit button */}
          <IconButton
            aria-label="edit"
            size="small"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

export default EditableName;
