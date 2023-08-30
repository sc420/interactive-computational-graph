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
  type ChangeEvent,
  type FunctionComponent,
  type SyntheticEvent,
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
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {/* Reverse-mode differentiation */}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isReverseMode}
              onChange={handleReverseModeChange}
              size="small"
              // Need to override the color because it will be put on AppBar
              color="secondary"
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: "black",
                },
              }}
            />
          }
          label={
            <Typography variant="body2">
              Reverse-Mode Differentiation
            </Typography>
          }
        />
      </FormGroup>

      {/* Derivative target */}
      <FormGroup>
        <Autocomplete
          data-testid="derivative-target"
          options={nodeIds}
          value={derivativeTarget}
          sx={{
            width: 200,
            // Need to override the color because it will be put on AppBar
            "& label": {
              color: "primary.contrastText",
            },
            "& label.Mui-focused": {
              color: "grey.300",
            },
            "& .MuiInputBase-input": {
              color: "primary.contrastText",
            },
            "& .MuiOutlinedInput-root fieldset": {
              borderColor: "grey.300",
            },
            "& .MuiOutlinedInput-root:hover fieldset": {
              borderColor: "grey.50",
            },
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "grey.100",
            },
          }}
          size="small"
          onChange={handleDerivativeTargetChange}
          renderInput={(params) => (
            <TextField {...params} label="Derivative Target" />
          )}
        />
      </FormGroup>
    </Box>
  );
};

export default GraphToolbar;
