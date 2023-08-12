import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { type FunctionComponent } from "react";

interface NodeTitleProps {
  graphId: string;
  backgroundColor: string;
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  graphId,
  backgroundColor,
}) => {
  return (
    <Box
      borderBottom={1}
      borderColor="divider"
      // corresponds to dragHandle when creating new reactflow.Node
      className="drag-handle"
      sx={{ backgroundColor }}
      px={0.5}
    >
      <Grid alignItems="center" container justifyContent="space-between">
        <Grid item>
          <Box display="flex" alignItems="center">
            {/* Drag indicator */}
            <DragIndicatorIcon fontSize="small" />
            {/* Graph ID */}
            <Typography fontWeight={500}>{graphId}</Typography>
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
