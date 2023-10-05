import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import {
  useCallback,
  useState,
  type FunctionComponent,
  type KeyboardEvent,
} from "react";

interface EditableNameProps {
  name: string;
  onNameChange: (name: string) => void;
}

const EditableName: FunctionComponent<EditableNameProps> = ({
  name,
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
          <Typography variant="body1">{name}</Typography>
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
