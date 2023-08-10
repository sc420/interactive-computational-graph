import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography,
} from "@mui/material";
import { type FunctionComponent } from "react";
import type Operation from "../features/Operation";
import DraggableItem from "./DraggableItem";

interface AddNodesPanelProps {
  onAddNode: (nodeType: string) => void;
  operations: Operation[];
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  onAddNode,
  operations,
}) => {
  const simpleOperations = operations.filter(
    (operation) => operation.category === "SIMPLE",
  );
  const customOperations = operations.filter(
    (operation) => operation.category === "CUSTOM",
  );

  return (
    <>
      <Accordion disableGutters>
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

      <Accordion disableGutters>
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

      <Accordion disableGutters>
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
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AddNodesPanel;
