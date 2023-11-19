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
import type FeatureOperation from "../features/FeatureOperation";
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
    // TODO(sc420): Validate and build updated operation
    onSave(readOperation);
  }, [onSave, readOperation]);

  const handleTabChange = useCallback(
    (event: SyntheticEvent, newIndex: number): void => {
      setActiveTabIndex(newIndex);
    },
    [],
  );

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      {/* Title */}
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Operation: {readOperation.text}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        <EditOperationTabPanel index={0} value={activeTabIndex}>
          Basic
        </EditOperationTabPanel>
        <EditOperationTabPanel index={1} value={activeTabIndex}>
          Input Ports
        </EditOperationTabPanel>
        <EditOperationTabPanel index={2} value={activeTabIndex}>
          F Code
        </EditOperationTabPanel>
        <EditOperationTabPanel index={3} value={activeTabIndex}>
          DF/DX Code
        </EditOperationTabPanel>
      </Box>
    </Dialog>
  );
};

export default EditOperationDialog;
