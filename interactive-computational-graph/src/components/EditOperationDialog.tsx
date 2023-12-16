import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
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
import Operation from "../core/Operation";
import type Port from "../core/Port";
import type FeatureOperation from "../features/FeatureOperation";
import EditOperationBasicTab from "./EditOperationBasicTab";
import EditOperationDialogMenu from "./EditOperationDialogMenu";
import EditOperationFCodeTab from "./EditOperationFCodeTab";
import EditOperationInputPortsTab from "./EditOperationInputPortsTab";
import EditOperationTabPanel from "./EditOperationTabPanel";
import EditOperationDfdxCodeTab from "./EditOperationDfdxCodeTab";

interface EditOperationDialogProps {
  open: boolean;
  readOperation: FeatureOperation;
  isDarkMode: boolean;
  onCancel: () => void;
  onSave: (updatedOperation: FeatureOperation) => void;
  onDelete: (operationId: string) => void;
}

const EditOperationDialog: FunctionComponent<EditOperationDialogProps> = ({
  open,
  readOperation,
  isDarkMode,
  onCancel,
  onSave,
  onDelete,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editingOperation, setEditingOperation] =
    useState<FeatureOperation>(readOperation);
  const [isValid, setValid] = useState(true);

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
      setEditingOperation((featureOperation) => {
        const newOperation: FeatureOperation = {
          ...featureOperation,
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
    setEditingOperation((featureOperation) => {
      const newOperation: FeatureOperation = {
        ...featureOperation,
        inputPorts,
      };

      return newOperation;
    });
  }, []);

  const handleFCodeChangeValues = useCallback((fCode: string) => {
    setEditingOperation((featureOperation) => {
      const newOperation: FeatureOperation = {
        ...featureOperation,
        operation: new Operation(
          fCode,
          featureOperation.operation.getDfdxCode(),
        ),
      };

      return newOperation;
    });
  }, []);

  const handleDfdxCodeChangeValues = useCallback((dfdxCode: string) => {
    setEditingOperation((featureOperation) => {
      const newOperation: FeatureOperation = {
        ...featureOperation,
        operation: new Operation(
          featureOperation.operation.getFCode(),
          dfdxCode,
        ),
      };

      return newOperation;
    });
  }, []);

  const handleValidate = useCallback((isValid: boolean) => {
    setValid(isValid);
  }, []);

  return (
    <Dialog fullScreen scroll="paper" open={open} onClose={handleClose}>
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
            disabled={!isValid}
            color="inherit"
            onClick={handleSave}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <DialogContent sx={{ p: 0 }}>
        {/* Tab navigator */}
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
          <Box sx={{ p: 3 }}>
            <EditOperationBasicTab
              name={editingOperation.text}
              prefix={editingOperation.namePrefix}
              helpText={editingOperation.helpText}
              onChangeValues={handleBasicChangeValues}
              onValidate={handleValidate}
            />
          </Box>
        </EditOperationTabPanel>
        {/* Input ports */}
        <EditOperationTabPanel index={1} value={activeTabIndex}>
          <Box sx={{ p: 3 }}>
            <EditOperationInputPortsTab
              isVisible={activeTabIndex === 1}
              inputPorts={editingOperation.inputPorts}
              onChangeValues={handleInputPortsChangeValues}
              onValidate={handleValidate}
            />
          </Box>
        </EditOperationTabPanel>
        {/* f code */}
        <EditOperationTabPanel index={2} value={activeTabIndex}>
          <Box sx={{ p: 3 }}>
            <EditOperationFCodeTab
              fCode={editingOperation.operation.getFCode()}
              inputPorts={editingOperation.inputPorts}
              isDarkMode={isDarkMode}
              onChangeValues={handleFCodeChangeValues}
            />
          </Box>
        </EditOperationTabPanel>
        {/* df/dx code */}
        <EditOperationTabPanel index={3} value={activeTabIndex}>
          <Box sx={{ p: 3 }}>
            <EditOperationDfdxCodeTab
              dfdxCode={editingOperation.operation.getDfdxCode()}
              inputPorts={editingOperation.inputPorts}
              isDarkMode={isDarkMode}
              onChangeValues={handleDfdxCodeChangeValues}
            />
          </Box>
        </EditOperationTabPanel>

        <Box sx={{ p: 3 }}>
          <Alert variant="outlined" severity="info">
            Changes will be lost after reloading the page
          </Alert>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditOperationDialog;
