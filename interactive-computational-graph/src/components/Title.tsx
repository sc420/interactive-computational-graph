import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import {
  useCallback,
  type ChangeEvent,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";
import { SIDEBAR_EXPANDED_WIDTH, TITLE_HEIGHT } from "../constants";

interface TitleProps {
  // Sidebar
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  // Theme
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  // Graph toolbar
  isReverseMode: boolean;
  derivativeTarget: string | null;
  nodeIds: string[];
  onReverseModeChange: (isReversedMode: boolean) => void;
  onDerivativeTargetChange: (nodeId: string | null) => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// Reference: https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: `${TITLE_HEIGHT}px`, // make it the same height regardless of the screen width
  ...(open === true && {
    marginLeft: SIDEBAR_EXPANDED_WIDTH,
    width: `calc(100% - ${SIDEBAR_EXPANDED_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Title: FunctionComponent<TitleProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  isDarkMode,
  onToggleDarkMode,
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
    <AppBar elevation={0} open={isSidebarOpen} position="absolute">
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
          minHeight: `${TITLE_HEIGHT}px !important`, // keep the typography at the center vertically
          columnGap: 3,
        }}
      >
        {/* Menu icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          sx={{
            marginRight: "36px",
            ...(isSidebarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Interactive Computational Graph
        </Typography>

        {/* Graph toolbar */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Reverse-mode differentiation */}
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

          {/* Derivative target */}
          <FormGroup>
            <Autocomplete
              data-testid="derivative-target"
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

        {/* Icons */}
        <Stack direction="row" spacing={1}>
          {/* Theme icon */}
          <IconButton onClick={onToggleDarkMode} color="inherit">
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* GitHub icon */}
          <IconButton
            aria-label="github"
            href="https://github.com/sc420/interactive-computational-graph"
            target="_blank"
          >
            <GitHubIcon sx={{ color: "white" }} />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Title;
