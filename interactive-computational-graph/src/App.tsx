import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useCallback, useState, type FunctionComponent } from "react";
import FeatureNavigator from "./components/FeatureNavigator";
import GraphContainer from "./components/GraphContainer";
import Sidebar from "./components/Sidebar";
import type SelectedFeature from "./features/SelectedFeature";

const App: FunctionComponent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] =
    useState<SelectedFeature | null>("add-nodes");

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
      mode: "light", // TODO(sc420): Add button to switch dark/light
    },
  });

  const toggleSidebar = useCallback((): void => {
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleFeature = useCallback((feature: SelectedFeature | null): void => {
    setSelectedFeature(feature);
  }, []);

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
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
