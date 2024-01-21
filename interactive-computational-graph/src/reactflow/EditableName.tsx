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
  onEditingChange: (isEditing: boolean) => void;
  onNameChange: (name: string) => void;
}

const EditableName: FunctionComponent<EditableNameProps> = ({
  name,
  operationData,
  onEditingChange,
  onNameChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);

  const updateEditing = useCallback(
    (isEditing: boolean) => {
      setIsEditing(isEditing);
      onEditingChange(isEditing);
    },
    [onEditingChange],
  );

  const updateName = useCallback(
    (name: string) => {
      setEditingName(name.trim());
      onNameChange(name.trim());
    },
    [onNameChange],
  );

  const handleChange = useCallback((name: string) => {
    setEditingName(name);
  }, []);

  const handleSaveName = useCallback(
    (name: string) => {
      updateEditing(false);
      updateName(name);
    },
    [updateEditing, updateName],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        updateName(editingName);
        updateEditing(false);
      } else if (e.key === "Escape") {
        setEditingName(name);
        updateEditing(false);
      }
    },
    [editingName, name, updateEditing, updateName],
  );

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {isEditing ? (
        <TextField
          inputProps={{
            "aria-label": "editingName",
          }}
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
              updateEditing(true);
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
