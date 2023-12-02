import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useState,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";
import type Port from "../core/Port";
import type FeatureOperation from "../features/FeatureOperation";
import EditOperationBasicTab from "./EditOperationBasicTab";
import EditOperationDialogMenu from "./EditOperationDialogMenu";
import EditOperationInputPortsTab from "./EditOperationInputPortsTab";
import EditOperationTabPanel from "./EditOperationTabPanel";

interface EditOperationDialogProps {
  open: boolean;
  readOperation: FeatureOperation;
  onCancel: () => void;
  onSave: (updatedOperation: FeatureOperation) => void;
  onDelete: (operationId: string) => void;
}

const EditOperationDialog: FunctionComponent<EditOperationDialogProps> = ({
  open,
  readOperation,
  onCancel,
  onSave,
  onDelete,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editingOperation, setEditingOperation] =
    useState<FeatureOperation>(readOperation);
  const [hasValidationError, setValidationError] = useState(false);

  const getTabProps = useCallback((index: number): Record<string, string> => {
    return {
      id: `edit-operation-tab-${index}`,
      "aria-controls": `edit-operation-tabpanel-${index}`,
    };
  }, []);

  const handleClose = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleSave = useCallback(() => {
    onSave(editingOperation);
  }, [editingOperation, onSave]);

  const handleDelete = useCallback(() => {
    onDelete(editingOperation.id);
  }, [onDelete, editingOperation.id]);

  const handleTabChange = useCallback(
    (event: SyntheticEvent, newIndex: number): void => {
      setActiveTabIndex(newIndex);
    },
    [],
  );

  const handleBasicChangeValues = useCallback(
    (name: string, prefix: string, helpText: string) => {
      setEditingOperation((operation) => {
        const newOperation: FeatureOperation = {
          ...operation,
          text: name,
          namePrefix: prefix,
          helpText,
        };

        return newOperation;
      });
    },
    [],
  );

  const handleInputPortsChangeValues = useCallback((inputPorts: Port[]) => {
    setEditingOperation((operation) => {
      const newOperation: FeatureOperation = {
        ...operation,
        inputPorts,
      };

      return newOperation;
    });
  }, []);

  const handleValidate = useCallback((hasError: boolean) => {
    setValidationError(hasError);
  }, []);

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      {/* Toolbar */}
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          {/* Close button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Operation: {editingOperation.text}
          </Typography>

          {/* Menu */}
          <EditOperationDialogMenu onDelete={handleDelete} />

          {/* Save */}
          <Button
            autoFocus
            disabled={hasValidationError}
            color="inherit"
            onClick={handleSave}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box>
        <Box borderBottom={1} borderColor="divider">
          <Tabs
            value={activeTabIndex}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Basic" {...getTabProps(0)} />
            <Tab label="Input Ports" {...getTabProps(1)} />
            <Tab label="F Code" {...getTabProps(2)} />
            <Tab label="DF/DX Code" {...getTabProps(3)} />
          </Tabs>
        </Box>

        {/* Basic */}
        <EditOperationTabPanel index={0} value={activeTabIndex}>
          <EditOperationBasicTab
            name={readOperation.text}
            prefix={readOperation.namePrefix}
            helpText={readOperation.helpText}
            onChangeValues={handleBasicChangeValues}
            onValidate={handleValidate}
          />
        </EditOperationTabPanel>

        {/* Input ports */}
        <EditOperationTabPanel index={1} value={activeTabIndex}>
          <EditOperationInputPortsTab
            isVisible={activeTabIndex === 1}
            inputPorts={readOperation.inputPorts}
            onChangeValues={handleInputPortsChangeValues}
            onValidate={handleValidate}
          />
        </EditOperationTabPanel>

        {/* f code */}
        <EditOperationTabPanel index={2} value={activeTabIndex}>
          F Code
        </EditOperationTabPanel>

        {/* df/dx code */}
        <EditOperationTabPanel index={3} value={activeTabIndex}>
          DF/DX Code
        </EditOperationTabPanel>
      </Box>
    </Dialog>
  );
};

export default EditOperationDialog;
