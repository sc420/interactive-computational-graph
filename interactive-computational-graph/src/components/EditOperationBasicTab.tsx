import { Container, Stack, TextField } from "@mui/material";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FunctionComponent,
} from "react";

interface EditOperationBasicTabProps {
  name: string;
  prefix: string;
  helpText: string;
  onChangeValues: (name: string, prefix: string, helpText: string) => void;
  onValidate: (isValid: boolean) => void;
}

const EditOperationBasicTab: FunctionComponent<EditOperationBasicTabProps> = ({
  name,
  prefix,
  helpText,
  onChangeValues,
  onValidate,
}) => {
  const [editingName, setEditingName] = useState(name);
  const [nameHasError, setNameHasError] = useState(false);

  const [editingPrefix, setEditingPrefix] = useState(prefix);

  const [editingHelpText, setEditingHelpText] = useState(helpText);

  // Validate and update the values when the input values change
  useEffect(() => {
    const isNameEmpty = editingName === "";
    setNameHasError(isNameEmpty);

    const isValid = !isNameEmpty;
    onValidate(isValid);

    if (!isValid) {
      return;
    }

    onChangeValues(editingName, editingPrefix, editingHelpText);
  }, [editingHelpText, editingName, editingPrefix, onChangeValues, onValidate]);

  return (
    <Container>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" justifyContent="space-between" spacing={3}>
          {/* Name */}
          <TextField
            id="edit-operation-name"
            inputProps={{
              "data-testid": "nameInput",
            }}
            label="Name"
            required
            defaultValue={name}
            helperText="Display text on the side panel"
            fullWidth
            error={nameHasError}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEditingName(event.target.value.trim());
            }}
          />

          {/* Prefix */}
          <TextField
            id="edit-operation-prefix"
            inputProps={{
              "data-testid": "prefixInput",
            }}
            label="Prefix"
            defaultValue={prefix}
            helperText="Name prefix (LaTeX) for new nodes"
            fullWidth
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEditingPrefix(event.target.value.trim());
            }}
          />
        </Stack>

        {/* Help text */}
        <TextField
          id="edit-operation-help-text"
          inputProps={{
            "data-testid": "helpTextInput",
          }}
          label="Help Text"
          defaultValue={helpText}
          helperText="Tooltip displayed when mouse hovers over items in the side panel and over the operation names on the nodes"
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEditingHelpText(event.target.value.trim());
          }}
        />
      </Stack>
    </Container>
  );
};

export default EditOperationBasicTab;
