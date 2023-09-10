import { Box } from "@mui/material";
import { type FunctionComponent, type ReactElement } from "react";
import { TITLE_HEIGHT } from "../constants";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import type SelectedFeature from "../features/SelectedFeature";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";
import ExplainDerivativesPanel from "./ExplainDerivativesPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
  featureOperations: FeatureOperation[];
  hasNodes: boolean;
  hasDerivativeTarget: boolean;
  explainDerivativeData: ExplainDerivativeData[];
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  onClearSelection: () => void;
}

const FeaturePanel: FunctionComponent<FeaturePanelProps> = ({
  feature,
  featureOperations,
  hasNodes,
  hasDerivativeTarget,
  explainDerivativeData,
  onAddNode,
  onAddOperation,
  onClearSelection,
}) => {
  const renderSelectedPanel = (): ReactElement => {
    switch (feature) {
      case "add-nodes":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
          />
        );
      case "view-nodes":
        return <EditNodesPanel />;
      case "explain-derivatives":
        return (
          <ExplainDerivativesPanel
            hasNodes={hasNodes}
            hasDerivativeTarget={hasDerivativeTarget}
            explainDerivativeData={explainDerivativeData}
            onClearSelection={onClearSelection}
          />
        );
      case "network-builder":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
          />
        );
      case "examples":
        return <EditNodesPanel />;
      case "load-save":
        return <EditNodesPanel />;
    }
  };
  return (
    <Box width={270} height={`calc(100vh - ${TITLE_HEIGHT}px)`} overflow="auto">
      {renderSelectedPanel()}
    </Box>
  );
};

export default FeaturePanel;
