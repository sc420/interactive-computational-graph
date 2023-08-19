import { Box } from "@mui/material";
import { type FunctionComponent, type ReactElement } from "react";
import type FeatureOperation from "../features/FeatureOperation";
import type SelectedFeature from "../features/SelectedFeature";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
  featureOperations: FeatureOperation[];
  onAddNode: (nodeType: string) => void;
  onAddOperation: () => void;
}

const FeaturePanel: FunctionComponent<FeaturePanelProps> = ({
  feature,
  featureOperations,
  onAddNode,
  onAddOperation,
}) => {
  const renderSelectedPanel = (): ReactElement => {
    switch (feature) {
      case "dashboard":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
          />
        );
      case "orders":
        return <EditNodesPanel />;
      case "customers":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
          />
        );
      case "reports":
        return <EditNodesPanel />;
      case "integrations":
        return <EditNodesPanel />;
    }
  };
  return <Box sx={{ width: 250 }}>{renderSelectedPanel()}</Box>;
};

export default FeaturePanel;
