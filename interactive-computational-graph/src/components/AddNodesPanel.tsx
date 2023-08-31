import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { type FunctionComponent } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import DraggableItem from "./DraggableItem";

interface AddNodesPanelProps {
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  featureOperations: FeatureOperation[];
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  onAddNode,
  onAddOperation,
  featureOperations,
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
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        px={2}
        py={0.5}
      >
        <Grid item>
          <Typography variant="subtitle1">Add nodes</Typography>
        </Grid>
        <Grid item>
          <Button startIcon={<EditIcon />}>Edit</Button>
        </Grid>
      </Grid>

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
              onClick={onAddNode}
            />
            <DraggableItem
              featureNodeType={{ nodeType: "VARIABLE" }}
              text="Variable"
              onClick={onAddNode}
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
                onClick={onAddNode}
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
                onClick={onAddNode}
              />
            ))}
            {/* Add operation */}
            <ListItem onClick={onAddOperation}>
              <Button startIcon={<AddIcon />}>Add Operation</Button>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AddNodesPanel;
