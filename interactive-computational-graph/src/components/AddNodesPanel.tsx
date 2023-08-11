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
import { useState, type FunctionComponent } from "react";
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
  const [valueExpanded, setValueExpanded] = useState<boolean>(true);
  const [simpleExpanded, setSimpleExpanded] = useState<boolean>(true);
  const [customExpanded, setCustomExpanded] = useState<boolean>(true);

  const simpleOperations = operations.filter(
    (operation) => operation.category === "SIMPLE",
  );
  const customOperations = operations.filter(
    (operation) => operation.category === "CUSTOM",
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
      <Accordion
        disableGutters
        expanded={valueExpanded}
        onChange={() => {
          setValueExpanded(!valueExpanded);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="value-content"
          id="value-header"
        >
          <Typography>Value</Typography>
        </AccordionSummary>
        <AccordionDetails id="value-content" sx={{ p: 0 }}>
          <List>
            <DraggableItem onClick={onAddNode} text="Variable" />
            <DraggableItem onClick={onAddNode} text="Constant" />
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Simple operations */}
      <Accordion
        disableGutters
        expanded={simpleExpanded}
        onChange={() => {
          setSimpleExpanded(!simpleExpanded);
        }}
      >
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
                onClick={onAddNode}
                text={operation.id}
              />
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Custom operations */}
      <Accordion
        disableGutters
        expanded={customExpanded}
        onChange={() => {
          setCustomExpanded(!customExpanded);
        }}
      >
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
                onClick={onAddNode}
                text={operation.id}
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
