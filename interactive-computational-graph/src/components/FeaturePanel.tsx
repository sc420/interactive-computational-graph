import { Box } from "@mui/material";
import { type FunctionComponent } from "react";
import type SelectedFeature from "../features/SelectedFeature";
import AddNodesPanel from "./AddNodesPanel";
import EditNodesPanel from "./EditNodesPanel";

interface FeaturePanelProps {
  feature: SelectedFeature;
}

const FeaturePanel: FunctionComponent<FeaturePanelProps> = ({ feature }) => {
  const featureToPanel: Record<SelectedFeature, React.FC> = {
    dashboard: AddNodesPanel,
    orders: EditNodesPanel,
    customers: AddNodesPanel,
    reports: EditNodesPanel,
    integrations: EditNodesPanel,
  };

  const SelectedPanel = featureToPanel[feature];

  return <Box sx={{ width: 250 }}>{<SelectedPanel />}</Box>;
};

export default FeaturePanel;
