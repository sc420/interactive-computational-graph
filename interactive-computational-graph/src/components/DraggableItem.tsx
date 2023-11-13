import EditIcon from "@mui/icons-material/Edit";
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
  onClickItem: (featureNodeType: FeatureNodeType) => void;
  onClickEditIcon: (featureNodeType: FeatureNodeType) => void;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  featureNodeType,
  text,
  onClickItem,
  onClickEditIcon,
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
        <IconButton
          edge="end"
          size="small"
          onClick={() => {
            onClickEditIcon(featureNodeType);
          }}
          aria-label={`Edit ${text}`}
        >
          <EditIcon />
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
          onClickItem(featureNodeType);
        }}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default DraggableItem;
