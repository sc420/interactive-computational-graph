import { Grid, Typography } from "@mui/material";
import { type FunctionComponent } from "react";

const ExplainDerivativesPanel: FunctionComponent = () => {
  return (
    <>
      {/* Header and toolbar */}
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
        px={2}
        py={0.5}
      >
        <Grid item>
          <Typography variant="subtitle1">Explain derivatives</Typography>
        </Grid>
      </Grid>
      ...
    </>
  );
};

export default ExplainDerivativesPanel;
