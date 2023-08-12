import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useCallback, type DragEvent, type FunctionComponent } from "react";

interface DraggableItemProps {
  nodeType: string;
  text: string;
  onClick: (nodeType: string) => void;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  nodeType,
  text,
  onClick,
}) => {
  const handleDragStart = useCallback(
    (event: DragEvent): void => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    [nodeType],
  );

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
          handleDragStart(event);
        }}
        onClick={() => {
          onClick(nodeType);
        }}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default DraggableItem;
