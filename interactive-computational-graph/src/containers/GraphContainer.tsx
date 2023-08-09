import { Grid, Toolbar } from "@mui/material";
import React from "react";
import FeaturePanel from "../components/FeaturePanel";
import Graph from "../components/Graph";
import GraphToolbar from "../components/GraphToolbar";
import { TITLE_HEIGHT } from "../constants";
import type SelectedFeature from "../features/SelectedFeature";

interface GraphContainerProps {
  selectedFeature: SelectedFeature | null;
}

const GraphContainer: React.FunctionComponent<GraphContainerProps> = ({
  selectedFeature,
}) => {
  const handleAddNode = (nodeType: string): void => {
    // TODO(sc420): Call API in GraphStateController
  };

  return (
    <React.Fragment>
      <Toolbar />
      <Grid
        container
        direction="row"
        sx={{ height: `calc(100% - ${TITLE_HEIGHT}px)` }}
      >
        {/* Feature panel */}
        {selectedFeature !== null && (
          <Grid item borderRight="1px solid" borderColor="divider">
            <FeaturePanel feature={selectedFeature} onAddNode={handleAddNode} />
          </Grid>
        )}

        <Grid item display="flex" flexGrow={1}>
          <Grid container direction="column" flexGrow={1}>
            {/* Graph toolbar */}
            <Grid item>
              <GraphToolbar />
            </Grid>
            {/* Graph */}
            <Grid item display="flex" flexGrow={1}>
              <Graph />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default GraphContainer;
