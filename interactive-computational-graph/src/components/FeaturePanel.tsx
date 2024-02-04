import { Box } from "@mui/material";
import { type FunctionComponent, type ReactElement } from "react";
import { TITLE_HEIGHT } from "../constants";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import type FeatureNodeType from "../features/FeatureNodeType";
import type FeatureOperation from "../features/FeatureOperation";
import type SelectedFeature from "../features/SelectedFeature";
import type GraphContainerState from "../states/GraphContainerState";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";
import ExplainDerivativesPanel from "./ExplainDerivativesPanel";
import SaveLoadPanel from "./SaveLoadPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
  featureOperations: FeatureOperation[];
  operationIdsAddedAtLeastOnce: Set<string>;
  isDarkMode: boolean;
  hasNodes: boolean;
  hasDerivativeTarget: boolean;
  explainDerivativeData: ExplainDerivativeData[];
  onAddNode: (featureNodeType: FeatureNodeType) => void;
  onAddOperation: () => void;
  onEditOperation: (updatedOperation: FeatureOperation) => void;
  onDeleteOperation: (operationId: string) => void;
  onClearSelection: () => void;
  onSelectNode: (nodeId: string) => void;
  onSave: () => GraphContainerState;
  onLoad: (graphContainerState: GraphContainerState) => void;
}

const FeaturePanel: FunctionComponent<FeaturePanelProps> = ({
  feature,
  featureOperations,
  operationIdsAddedAtLeastOnce,
  isDarkMode,
  hasNodes,
  hasDerivativeTarget,
  explainDerivativeData,
  onAddNode,
  onAddOperation,
  onEditOperation,
  onDeleteOperation,
  onClearSelection,
  onSelectNode,
  onSave,
  onLoad,
}) => {
  const renderSelectedPanel = (): ReactElement => {
    switch (feature) {
      case "add-nodes":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            operationIdsAddedAtLeastOnce={operationIdsAddedAtLeastOnce}
            isDarkMode={isDarkMode}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
            onEditOperation={onEditOperation}
            onDeleteOperation={onDeleteOperation}
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
            onClickLatexLink={onSelectNode}
          />
        );
      case "network-builder":
        return (
          <AddNodesPanel
            featureOperations={featureOperations}
            operationIdsAddedAtLeastOnce={operationIdsAddedAtLeastOnce}
            isDarkMode={isDarkMode}
            onAddNode={onAddNode}
            onAddOperation={onAddOperation}
            onEditOperation={onEditOperation}
            onDeleteOperation={onDeleteOperation}
          />
        );
      case "examples":
        return <EditNodesPanel />;
      case "load-save":
        return <SaveLoadPanel onSave={onSave} onLoad={onLoad} />;
    }
  };
  return (
    <Box width={270} height={`calc(100vh - ${TITLE_HEIGHT}px)`} overflow="auto">
      {renderSelectedPanel()}
    </Box>
  );
};

export default FeaturePanel;
