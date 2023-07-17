import { Grid, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import FeaturePanel from "../components/FeaturePanel";
import { TITLE_HEIGHT } from "../constants";
import GraphContainer from "./GraphContainer";

interface MainContainerProps {
  selectedFeature: string | null;
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

MainContainer.propTypes = {
  selectedFeature: PropTypes.string.isRequired,
};

export default MainContainer;
