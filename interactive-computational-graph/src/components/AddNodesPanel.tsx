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
import { useState, type FunctionComponent, useCallback, useMemo } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import DraggableItem from "./DraggableItem";
import EditOperationDialog from "./EditOperationDialog";

interface AddNodesPanelProps {
  featureOperations: FeatureOperation[];
  isDarkMode: boolean;
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  onEditOperation: (updatedOperation: FeatureOperation) => void;
  onDeleteOperation: (operationId: string) => void;
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  featureOperations,
  isDarkMode,
  onAddNode,
  onAddOperation,
  onEditOperation,
  onDeleteOperation,
}) => {
  const builtInOperationTypes: string[] = useMemo(
    () => ["basic", "aggregate", "trigonometric", "activation", "loss"],
    [],
  );

  const customOperations = useMemo(
    () => featureOperations.filter((operation) => operation.type === "custom"),
    [featureOperations],
  );

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] =
    useState<FeatureOperation | null>(null);

  const capitalizeFirstLetter = useCallback((word: string): string => {
    return word[0].toUpperCase() + word.slice(1);
  }, []);

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

      {/* Built-in operations */}
      {builtInOperationTypes.map((builtInOperationType) => {
        const filteredOperations = featureOperations.filter(
          (operation) => operation.type === builtInOperationType,
        );

        return (
          <Accordion
            key={builtInOperationType}
            defaultExpanded
            disableGutters
            square
            sx={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${builtInOperationType}-content`}
              id={`${builtInOperationType}-header`}
            >
              <Typography variant="subtitle2">
                {capitalizeFirstLetter(builtInOperationType)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              id={`${builtInOperationType}-content`}
              sx={{ p: 0 }}
            >
              <List>
                {filteredOperations.map((operation) => (
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
        );
      })}

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
          isDarkMode={isDarkMode}
          onCancel={handleCloseEditDialog}
          onSave={handleSaveOperation}
          onDelete={handleDeleteOperation}
        />
      )}
    </>
  );
};

export default AddNodesPanel;
