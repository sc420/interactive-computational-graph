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
  editable: boolean;
  onClickItem: (featureNodeType: FeatureNodeType) => void;
  onClickEditIcon: ((featureNodeType: FeatureNodeType) => void) | null;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  featureNodeType,
  text,
  editable,
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

  const handleClickEditIcon = useCallback(() => {
    if (onClickEditIcon === null) {
      return;
    }
    onClickEditIcon(featureNodeType);
  }, [featureNodeType, onClickEditIcon]);

  return (
    <ListItem
      disablePadding
      secondaryAction={
        editable ? (
          <IconButton
            edge="end"
            size="small"
            onClick={handleClickEditIcon}
            aria-label={`Edit ${text}`}
          >
            <EditIcon />
          </IconButton>
        ) : null
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
