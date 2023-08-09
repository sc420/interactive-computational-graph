import { ListItem } from "@mui/material";
import { type DragEvent, type FunctionComponent } from "react";

interface DraggableItemProps {
  text: string;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({ text }) => {
  const handleDragStart = (event: DragEvent, nodeType: string): void => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <ListItem
      draggable
      onDragStart={(event) => {
        handleDragStart(event, text);
      }}
      className="draggable-item"
    >
      {text}
    </ListItem>
  );
};

export default DraggableItem;
