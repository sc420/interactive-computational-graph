import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Divider, IconButton, Toolbar } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { type FunctionComponent, type ReactNode } from "react";
import { SIDEBAR_EXPANDED_WIDTH } from "../constants";

// Reference: https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: SIDEBAR_EXPANDED_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(open === false && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  children: ReactNode;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  children,
}) => {
  return (
    <Drawer variant="permanent" open={isSidebarOpen}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton
          aria-label="Toggle Sidebar"
          onClick={() => {
            onToggleSidebar();
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      {children}
    </Drawer>
  );
};

export default Sidebar;
