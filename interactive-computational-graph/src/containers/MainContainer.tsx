import { Grid, Toolbar } from "@mui/material";
import React from "react";
import FeaturePanel from "../components/FeaturePanel";
import { TITLE_HEIGHT } from "../constants";
import type SelectedFeature from "../features/SelectedFeature";
import GraphContainer from "./GraphContainer";

interface MainContainerProps {
  selectedFeature: SelectedFeature | null;
}

const MainContainer: React.FunctionComponent<MainContainerProps> = ({
  selectedFeature,
}) => {
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
            <FeaturePanel feature={selectedFeature} />
          </Grid>
        )}
        {/* Graph container */}
        <Grid item display="flex" flexGrow={1}>
          <GraphContainer />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MainContainer;
