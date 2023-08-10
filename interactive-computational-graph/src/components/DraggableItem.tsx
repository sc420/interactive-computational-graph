import DragHandleIcon from "@mui/icons-material/DragHandle";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
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
      dense
      draggable
      onDragStart={(event) => {
        handleDragStart(event, text);
      }}
      onClick={() => {
        onClick(text);
      }}
    >
      <ListItemIcon>
        <DragHandleIcon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default DraggableItem;
