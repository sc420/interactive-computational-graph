import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import FeatureNavigator from "./components/FeatureNavigator";
import GraphContainer from "./components/GraphContainer";
import Sidebar from "./components/Sidebar";
import type SelectedFeature from "./features/SelectedFeature";

const App: FunctionComponent = () => {
  // Check if user prefers dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] =
    useState<SelectedFeature | null>("add-nodes");
  const [isDarkMode, setDarkMode] = useState<boolean>(prefersDarkMode);

  const toggleSidebar = useCallback((): void => {
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleFeature = useCallback((feature: SelectedFeature | null): void => {
    setSelectedFeature(feature);
  }, []);

  const toggleDarkMode = useCallback((): void => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode]);

  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& label": {
              fontSize: 14,
            },
          },
          input: {
            fontSize: 14,
          },
          listbox: {
            fontSize: 14,
          },
        },
      },
    },
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height="100vh" width="100vw">
        <CssBaseline />

        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar}>
          <FeatureNavigator
            selectedItem={selectedFeature}
            onItemClick={toggleFeature}
          />
        </Sidebar>

        {/* Graph container */}
        <Box component="main" flexGrow={1}>
          <GraphContainer
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            selectedFeature={selectedFeature}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
