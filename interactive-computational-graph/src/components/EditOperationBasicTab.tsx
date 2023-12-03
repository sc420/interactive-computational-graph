import {
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
} from "@mui/material";
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
  onValidate: (hasError: boolean) => void;
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

  // Validate the values when the input values change
  useEffect(() => {
    const isNameEmpty = editingName === "";
    setNameHasError(isNameEmpty);

    onValidate(isNameEmpty);

    if (isNameEmpty) {
      return;
    }

    onChangeValues(editingName, editingPrefix, editingHelpText);
  }, [editingHelpText, editingName, editingPrefix, onChangeValues, onValidate]);

  return (
    <Container>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" justifyContent="space-between" spacing={3}>
          {/* Name */}
          <FormControl
            required
            error={nameHasError}
            variant="standard"
            fullWidth
          >
            <InputLabel htmlFor="edit-operation-name">Name</InputLabel>
            <Input
              id="edit-operation-name"
              defaultValue={name}
              aria-describedby="edit-operation-name-text"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setEditingName(event.target.value.trim());
              }}
            />
            <FormHelperText id="edit-operation-name-text">
              Display text on the side panel
            </FormHelperText>
          </FormControl>

          {/* Prefix */}
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="edit-operation-prefix">Prefix</InputLabel>
            <Input
              id="edit-operation-prefix"
              defaultValue={prefix}
              aria-describedby="edit-operation-prefix-text"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setEditingPrefix(event.target.value.trim());
              }}
            />
            <FormHelperText id="edit-operation-prefix-text">
              Name prefix (LaTeX) for new nodes
            </FormHelperText>
          </FormControl>
        </Stack>

        {/* Help text */}
        <FormControl variant="standard" fullWidth>
          <InputLabel htmlFor="edit-operation-help-text">Help Text</InputLabel>
          <Input
            id="edit-operation-help-text"
            defaultValue={helpText}
            aria-describedby="edit-operation-help-text-text"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEditingHelpText(event.target.value.trim());
            }}
          />
          <FormHelperText id="edit-operation-help-text-text">
            Markdown shown when mouse hovers on the item on the side panel
          </FormHelperText>
        </FormControl>
      </Stack>
    </Container>
  );
};

export default EditOperationBasicTab;
