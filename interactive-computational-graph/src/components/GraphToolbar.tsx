import {
  Autocomplete,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCallback,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";

interface GraphToolbarProps {
  nodeIds: string[];
  onDerivativeTargetChange: (nodeId: string | null) => void;
}

const GraphToolbar: FunctionComponent<GraphToolbarProps> = ({
  nodeIds,
  onDerivativeTargetChange,
}) => {
  const handleDerivativeTargetChange = useCallback(
    (event: SyntheticEvent, newValue: string | null) => {
      onDerivativeTargetChange(newValue);
    },
    [onDerivativeTargetChange],
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={1.5}
      sx={{ bgcolor: "primary.light" }}
    >
      <Box>
        <Typography fontWeight="500">Graph</Typography>
      </Box>

      <Box display="flex" alignItems="center">
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked size="small" />}
            label={
              <Typography variant="body2">
                Reverse-Mode Differentiation
              </Typography>
            }
          />
        </FormGroup>

        <FormGroup>
          <Autocomplete
            options={nodeIds}
            sx={{ width: 200 }}
            size="small"
            onChange={handleDerivativeTargetChange}
            renderInput={(params) => (
              <TextField {...params} label="Derivative Target" />
            )}
          />
        </FormGroup>
      </Box>
    </Box>
  );
};

export default GraphToolbar;
