import { ListItemButton } from "@mui/material";
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
    <ListItemButton
      draggable
      onDragStart={(event) => {
        handleDragStart(event, text);
      }}
      onClick={() => {
        onClick(text);
      }}
    >
      {text}
    </ListItemButton>
  );
};

export default DraggableItem;
