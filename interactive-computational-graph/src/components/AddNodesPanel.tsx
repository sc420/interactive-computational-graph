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
import { type FunctionComponent } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import DraggableItem from "./DraggableItem";

interface AddNodesPanelProps {
  featureOperations: FeatureOperation[];
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  onEditOperation: (featureNodeType: FeatureNodeType) => void;
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  featureOperations,
  onAddNode,
  onAddOperation,
  onEditOperation,
}) => {
  const simpleOperations = featureOperations.filter(
    (operation) => operation.type === "SIMPLE",
  );
  const customOperations = featureOperations.filter(
    (operation) => operation.type === "CUSTOM",
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
              onClickItem={onAddNode}
              onClickEditIcon={onEditOperation}
            />
            <DraggableItem
              featureNodeType={{ nodeType: "VARIABLE" }}
              text="Variable"
              onClickItem={onAddNode}
              onClickEditIcon={onEditOperation}
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
                onClickItem={onAddNode}
                onClickEditIcon={onEditOperation}
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
                onClickItem={onAddNode}
                onClickEditIcon={onEditOperation}
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
    </>
  );
};

export default AddNodesPanel;
