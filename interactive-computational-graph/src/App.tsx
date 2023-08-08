import { Box, CssBaseline } from "@mui/material";
import React from "react";
import FeatureNavigator from "./components/FeatureNavigator";
import Sidebar from "./components/Sidebar";
import Title from "./components/Title";
import MainContainer from "./containers/MainContainer";
import type SelectedFeature from "./features/SelectedFeature";

const App: React.FunctionComponent = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [selectedFeature, setSelectedFeature] =
    React.useState<SelectedFeature | null>("dashboard");

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleFeature = (feature: SelectedFeature | null): void => {
    setSelectedFeature(feature);
  };

  return (
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
      {/* Main */}
      <Box component="main" flexGrow={1}>
        <MainContainer selectedFeature={selectedFeature} />
      </Box>
    </Box>
  );
};

export default App;
