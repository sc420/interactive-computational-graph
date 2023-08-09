import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography,
} from "@mui/material";
import { type FunctionComponent } from "react";
import DraggableItem from "./DraggableItem";

interface AddNodesPanelProps {
  onAddNode: (nodeType: string) => void;
}

const AddNodesPanel: FunctionComponent<AddNodesPanelProps> = ({
  onAddNode,
}) => {
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
        <AccordionDetails id="value-content">
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
        <AccordionDetails id="simple-content">
          <List>
            <DraggableItem onClick={onAddNode} text="Sum" />
            <DraggableItem onClick={onAddNode} text="Product" />
            <DraggableItem onClick={onAddNode} text="Pow" />
            <DraggableItem onClick={onAddNode} text="Log" />
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AddNodesPanel;
