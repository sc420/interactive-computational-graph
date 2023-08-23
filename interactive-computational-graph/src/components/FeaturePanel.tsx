import { Box } from "@mui/material";
import { type FunctionComponent, type ReactElement } from "react";
import { TITLE_HEIGHT } from "../constants";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import type SelectedFeature from "../features/SelectedFeature";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
  featureOperations: FeatureOperation[];
  onAddNode: (featureNodeType: FeatureNodeType) => void;
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
  return (
    <Box width={250} height={`calc(100vh - ${TITLE_HEIGHT}px)`} overflow="auto">
      {renderSelectedPanel()}
    </Box>
  );
};

export default FeaturePanel;
