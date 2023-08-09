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

const AddNodesPanel: FunctionComponent = () => {
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
            <DraggableItem text="Variable" />
            <DraggableItem text="Constant" />
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
            <DraggableItem text="Sum" />
            <DraggableItem text="Product" />
            <DraggableItem text="Pow" />
            <DraggableItem text="Log" />
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AddNodesPanel;
