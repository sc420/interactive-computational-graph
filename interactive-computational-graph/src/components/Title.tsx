import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { type ReactNode, type FunctionComponent } from "react";
import { SIDEBAR_EXPANDED_WIDTH, TITLE_HEIGHT } from "../constants";

interface TitleProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  children: ReactNode;
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
  children,
}) => {
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
          aria-label="Open menu"
          onClick={() => {
            onToggleSidebar();
          }}
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

        {/* Children */}
        {children}

        {/* Function icons */}
        <Stack direction="row" spacing={1}>
          {/* Theme icon */}
          <Tooltip title="Switch light/dark mode">
            <IconButton
              aria-label="Switch light/dark mode"
              onClick={() => {
                onToggleDarkMode();
              }}
              color="inherit"
            >
              {isDarkMode ? (
                <DarkModeIcon aria-label="Dark mode" />
              ) : (
                <LightModeIcon aria-label="Light mode" />
              )}
            </IconButton>
          </Tooltip>

          {/* GitHub icon */}
          <Tooltip title="See GitHub repo">
            <IconButton
              aria-label="github"
              href="https://github.com/sc420/interactive-computational-graph"
              target="_blank"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Title;
