import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type FunctionComponent, useCallback } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import DraggableItem from "./DraggableItem";
import EditOperationDialog from "./EditOperationDialog";

interface AddNodesPanelProps {
  featureOperations: FeatureOperation[];
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  onEditOperation: (updatedOperation: FeatureOperation) => void;
  onDeleteOperation: (operationId: string) => void;
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  featureOperations,
  onAddNode,
  onAddOperation,
  onEditOperation,
  onDeleteOperation,
}) => {
  const simpleOperations = featureOperations.filter(
    (operation) => operation.type === "SIMPLE",
  );
  const customOperations = featureOperations.filter(
    (operation) => operation.type === "CUSTOM",
  );

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] =
    useState<FeatureOperation | null>(null);

  const handleOpenEditDialog = useCallback(
    (featureOperation: FeatureOperation) => {
      setEditingOperation(featureOperation);
      setEditDialogOpen(true);
    },
    [],
  );

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const handleSaveOperation = useCallback(
    (updatedOperation: FeatureOperation) => {
      setEditDialogOpen(false);
      onEditOperation(updatedOperation);
    },
    [onEditOperation],
  );

  const handleDeleteOperation = useCallback(
    (operationId: string) => {
      setEditDialogOpen(false);
      onDeleteOperation(operationId);
    },
    [onDeleteOperation],
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
        <Typography variant="subtitle1">Add Nodes</Typography>
      </Stack>

      {/* Value nodes */}
      <Accordion defaultExpanded disableGutters square sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="value-content"
          id="value-header"
        >
          <Typography variant="subtitle2">Value</Typography>
        </AccordionSummary>
        <AccordionDetails id="value-content" sx={{ p: 0 }}>
          <List>
            <DraggableItem
              featureNodeType={{ nodeType: "CONSTANT" }}
              text="Constant"
              editable={false}
              onClickItem={onAddNode}
              onClickEditIcon={null}
            />
            <DraggableItem
              featureNodeType={{ nodeType: "VARIABLE" }}
              text="Variable"
              editable={false}
              onClickItem={onAddNode}
              onClickEditIcon={null}
            />
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Simple operations */}
      <Accordion defaultExpanded disableGutters square sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="simple-content"
          id="simple-header"
        >
          <Typography variant="subtitle2">Simple</Typography>
        </AccordionSummary>
        <AccordionDetails id="simple-content" sx={{ p: 0 }}>
          <List>
            {simpleOperations.map((operation) => (
              <DraggableItem
                key={operation.id}
                featureNodeType={{
                  nodeType: "OPERATION",
                  operationId: operation.id,
                }}
                text={operation.text}
                editable
                onClickItem={onAddNode}
                onClickEditIcon={() => {
                  handleOpenEditDialog(operation);
                }}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Custom operations */}
      <Accordion defaultExpanded disableGutters square sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="custom-content"
          id="custom-header"
        >
          <Typography variant="subtitle2">Custom</Typography>
        </AccordionSummary>
        <AccordionDetails id="custom-content" sx={{ p: 0 }}>
          <List>
            {customOperations.map((operation) => (
              <DraggableItem
                key={operation.id}
                featureNodeType={{
                  nodeType: "OPERATION",
                  operationId: operation.id,
                }}
                text={operation.text}
                editable
                onClickItem={onAddNode}
                onClickEditIcon={() => {
                  handleOpenEditDialog(operation);
                }}
              />
            ))}
            {/* Add operation */}
            <ListItem
              onClick={() => {
                onAddOperation();
              }}
            >
              <Button startIcon={<AddIcon />}>Add Operation</Button>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Operation editing dialog */}
      {editingOperation !== null && isEditDialogOpen && (
        <EditOperationDialog
          open={isEditDialogOpen}
          readOperation={editingOperation}
          onCancel={handleCloseEditDialog}
          onSave={handleSaveOperation}
          onDelete={handleDeleteOperation}
        />
      )}
    </>
  );
};

export default AddNodesPanel;
