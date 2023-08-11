import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { type DragEvent, type FunctionComponent } from "react";

interface DraggableItemProps {
  text: string;
  onClick: (nodeType: string) => void;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  text,
  onClick,
}) => {
  const handleDragStart = (event: DragEvent, nodeType: string): void => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton edge="end">
          <DragHandleIcon />
        </IconButton>
      }
    >
      <ListItemButton
        dense
        draggable
        onDragStart={(event) => {
          handleDragStart(event, text);
        }}
        onClick={() => {
          onClick(text);
        }}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default DraggableItem;
