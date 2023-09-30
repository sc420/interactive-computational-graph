import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useMemo, type FunctionComponent } from "react";
import "./NodeTitle.css";

interface NodeTitleProps {
  text: string;
  backgroundColor: string;
  isDarkMode: boolean;
  isHighlighted: boolean;
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  text,
  backgroundColor,
  isDarkMode,
  isHighlighted,
}) => {
  const animationClassName = useMemo(() => {
    if (!isHighlighted) {
      return "";
    }
    return isDarkMode ? "striped-animation-dark" : "striped-animation-light";
  }, [isDarkMode, isHighlighted]);

  return (
    <Box
      // corresponds to dragHandle when creating new reactflow.Node
      className={`drag-handle ${animationClassName}`}
      sx={{ backgroundColor }}
      p={0.5}
    >
      <Grid alignItems="center" container justifyContent="space-between">
        <Grid item>
          <Box display="flex" alignItems="center">
            {/* Drag indicator */}
            <DragIndicatorIcon fontSize="small" />
            {/* Graph ID */}
            <Typography variant="body1">{text}</Typography>
          </Box>
        </Grid>
        <Grid item>
          {/* Edit button */}
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NodeTitle;
