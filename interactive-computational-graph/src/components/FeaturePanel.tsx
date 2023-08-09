import { Box } from "@mui/material";
import { type ReactElement, type FunctionComponent } from "react";
import type SelectedFeature from "../features/SelectedFeature";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
  onAddNode: (nodeType: string) => void;
}

const FeaturePanel: FunctionComponent<FeaturePanelProps> = ({
  feature,
  onAddNode,
}) => {
  const renderSelectedPanel = (): ReactElement => {
    switch (feature) {
      case "dashboard":
        return <AddNodesPanel onAddNode={onAddNode} />;
      case "orders":
        return <EditNodesPanel />;
      case "customers":
        return <AddNodesPanel onAddNode={onAddNode} />;
      case "reports":
        return <EditNodesPanel />;
      case "integrations":
        return <EditNodesPanel />;
    }
  };
  return <Box sx={{ width: 250 }}>{renderSelectedPanel()}</Box>;
};

export default FeaturePanel;
