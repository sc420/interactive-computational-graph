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
  useMemo,
  type ChangeEvent,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";

interface GraphToolbarProps {
  isReverseMode: boolean;
  derivativeTarget: string | null;
  nodeIds: string[];
  nodeNames: string[];
  onReverseModeChange: (isReversedMode: boolean) => void;
  onDerivativeTargetChange: (nodeId: string | null) => void;
}

interface AutocompleteOption {
  label: string;
  id: string;
}

const GraphToolbar: FunctionComponent<GraphToolbarProps> = ({
  isReverseMode,
  derivativeTarget,
  nodeIds,
  nodeNames,
  onReverseModeChange,
  onDerivativeTargetChange,
}) => {
  const options: AutocompleteOption[] = useMemo(() => {
    const seenNodeNames = new Set<string>();
    return nodeIds.map((nodeId, index) => {
      const nodeName = nodeNames[index];
      const label = seenNodeNames.has(nodeName)
        ? `${nodeName} (${nodeId})`
        : nodeName;

      seenNodeNames.add(nodeName);
      return {
        label,
        id: nodeId,
      };
    });
  }, [nodeIds, nodeNames]);

  const selectedValue: AutocompleteOption | null = useMemo(() => {
    const option = options.find((option) => option.id === derivativeTarget);
    if (option === undefined) {
      return null;
    }
    return option;
  }, [derivativeTarget, options]);

  const handleReverseModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onReverseModeChange(event.target.checked);
    },
    [onReverseModeChange],
  );

  const handleDerivativeTargetChange = useCallback(
    (event: SyntheticEvent, newValue: AutocompleteOption | null) => {
      if (newValue === null) {
        onDerivativeTargetChange(null);
      } else {
        onDerivativeTargetChange(newValue.id);
      }
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
              inputProps={{
                "aria-label": "toggle-differentiation-mode",
                name: "toggle-differentiation-mode",
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
          options={options}
          value={selectedValue}
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
