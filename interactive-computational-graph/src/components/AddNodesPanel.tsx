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
import type Operation from "../features/Operation";
import DraggableItem from "./DraggableItem";

interface AddNodesPanelProps {
  onAddNode: (nodeType: string) => void;
  onAddOperation: () => void;
  operations: Operation[];
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  onAddNode,
  onAddOperation,
  operations,
}) => {
  const simpleOperations = operations.filter(
    (operation) => operation.type === "SIMPLE",
  );
  const customOperations = operations.filter(
    (operation) => operation.type === "CUSTOM",
  );

  return (
    <>
      {/* Header and toolbar */}
      <Grid alignItems="center" container justifyContent="space-between" px={2}>
        <Grid item>
          <Typography fontWeight="500">Add nodes</Typography>
        </Grid>
        <Grid item>
          <Button startIcon={<EditIcon />}>Edit</Button>
        </Grid>
      </Grid>

      {/* Value nodes */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="value-content"
          id="value-header"
        >
          <Typography>Value</Typography>
        </AccordionSummary>
        <AccordionDetails id="value-content" sx={{ p: 0 }}>
          <List>
            <DraggableItem
              nodeType="_variable"
              text="Variable"
              onClick={onAddNode}
            />
            <DraggableItem
              nodeType="_constant"
              text="Constant"
              onClick={onAddNode}
            />
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Simple operations */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="simple-content"
          id="simple-header"
        >
          <Typography>Simple</Typography>
        </AccordionSummary>
        <AccordionDetails id="simple-content" sx={{ p: 0 }}>
          <List>
            {simpleOperations.map((operation) => (
              <DraggableItem
                key={operation.id}
                nodeType={operation.id}
                text={operation.text}
                onClick={onAddNode}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Custom operations */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="custom-content"
          id="custom-header"
        >
          <Typography>Custom</Typography>
        </AccordionSummary>
        <AccordionDetails id="custom-content" sx={{ p: 0 }}>
          <List>
            {customOperations.map((operation) => (
              <DraggableItem
                key={operation.id}
                nodeType={operation.id}
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
