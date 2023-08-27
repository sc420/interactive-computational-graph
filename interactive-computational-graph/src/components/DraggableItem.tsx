import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useCallback, type DragEvent, type FunctionComponent } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";

interface DraggableItemProps {
  featureNodeType: FeatureNodeType;
  text: string;
  onClick: (featureNodeType: FeatureNodeType) => void;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  featureNodeType,
  text,
  onClick,
}) => {
  const handleDragStart = useCallback(
    (event: DragEvent): void => {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify(featureNodeType),
      );
      event.dataTransfer.effectAllowed = "move";
    },
    [featureNodeType],
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
          onClick(featureNodeType);
        }}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default DraggableItem;
