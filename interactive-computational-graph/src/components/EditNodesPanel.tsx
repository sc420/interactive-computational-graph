import { List, ListItem, ListItemText } from "@mui/material";
import { type FunctionComponent } from "react";

const EditNodesPanel: FunctionComponent = () => {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText primary="Item 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Item 2" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Item 3" />
        </ListItem>
      </List>
    </>
  );
};

export default EditNodesPanel;
