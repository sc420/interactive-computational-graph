import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import FeatureNavigator from "./components/FeatureNavigator";
import GraphContainer from "./components/GraphContainer";
import Sidebar from "./components/Sidebar";
import Title from "./components/Title";
import type SelectedFeature from "./features/SelectedFeature";

const App: React.FunctionComponent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] =
    useState<SelectedFeature | null>("dashboard");

  const theme = createTheme({
    palette: {
      mode: "light", // TODO(sc420): Add button to switch dark/light
    },
  });

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleFeature = (feature: SelectedFeature | null): void => {
    setSelectedFeature(feature);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height="100vh" width="100vw">
        <CssBaseline />
        {/* Title */}
        <Title isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar}>
          <FeatureNavigator
            selectedItem={selectedFeature}
            onItemClick={toggleFeature}
          />
        </Sidebar>
        {/* Graph */}
        <Box component="main" flexGrow={1}>
          <GraphContainer selectedFeature={selectedFeature} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
