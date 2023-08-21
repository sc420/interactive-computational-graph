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
  type ChangeEvent,
} from "react";

interface GraphToolbarProps {
  isReverseMode: boolean;
  derivativeTarget: string | null;
  nodeIds: string[];
  onReverseModeChange: (isReversedMode: boolean) => void;
  onDerivativeTargetChange: (nodeId: string | null) => void;
}

const GraphToolbar: FunctionComponent<GraphToolbarProps> = ({
  isReverseMode,
  derivativeTarget,
  nodeIds,
  onReverseModeChange,
  onDerivativeTargetChange,
}) => {
  const handleReverseModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onReverseModeChange(event.target.checked);
    },
    [onReverseModeChange],
  );

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

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isReverseMode}
                onChange={handleReverseModeChange}
                size="small"
              />
            }
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
            value={derivativeTarget}
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
