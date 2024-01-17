import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useCallback, type DragEvent, type FunctionComponent } from "react";
import type FeatureNodeType from "../features/FeatureNodeType";

interface DraggableItemProps {
  featureNodeType: FeatureNodeType;
  text: string;
  helpText: string;
  editable: boolean;
  onClickItem: (featureNodeType: FeatureNodeType) => void;
  onClickEditIcon: ((featureNodeType: FeatureNodeType) => void) | null;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({
  featureNodeType,
  text,
  helpText,
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
    <Tooltip title={helpText} placement="right">
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
    </Tooltip>
  );
};

export default DraggableItem;
