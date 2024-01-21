import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Stack } from "@mui/material";
import { useCallback, useMemo, useState, type FunctionComponent } from "react";
import type OperationNodeData from "../features/OperationNodeData";
import EditableName from "./EditableName";
import "./NodeTitle.css";

interface NodeTitleProps {
  id: string;
  name: string;
  operationData: OperationNodeData | null;
  backgroundColor: string;
  isDarkMode: boolean;
  isHighlighted: boolean;
  onNameChange: (name: string) => void;
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  id,
  name,
  operationData,
  backgroundColor,
  isDarkMode,
  isHighlighted,
  onNameChange,
}) => {
  const animationClassName = useMemo(() => {
    if (!isHighlighted) {
      return "";
    }
    return isDarkMode ? "striped-animation-dark" : "striped-animation-light";
  }, [isDarkMode, isHighlighted]);

  const [isEditingName, setIsEditingName] = useState(false);

  const getClassName = useCallback(() => {
    if (isEditingName) {
      return `${animationClassName}`;
    } else {
      return `drag-handle ${animationClassName}`;
    }
  }, [animationClassName, isEditingName]);

  const handleEditingChange = useCallback((isEditing: boolean) => {
    setIsEditingName(isEditing);
  }, []);

  return (
    <Box
      data-testid={`node-title-${id}`}
      // corresponds to dragHandle when creating new reactflow.Node
      className={getClassName()}
      display="flex"
      sx={{ backgroundColor }}
      p={0.5}
    >
      <Stack direction="row" alignItems="center" flexGrow={1}>
        {/* Drag indicator */}
        <DragIndicatorIcon fontSize="small" />
        {/* Editable name */}
        <Box flexGrow={1}>
          <EditableName
            name={name}
            operationData={operationData}
            onEditingChange={handleEditingChange}
            onNameChange={onNameChange}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default NodeTitle;
