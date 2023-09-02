import { Grid, Link, Stack, Typography } from "@mui/material";
import { type FunctionComponent } from "react";
import Katex from "../latex/katex";

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

      <Stack spacing={1}>
        <Katex latex="\frac{\partial{e}}{\partial{b}} = \frac{\partial{c}}{\partial{b}} \cdot \frac{\partial{e}}{\partial{c}} + \frac{\partial{d}}{\partial{b}} \cdot \frac{\partial{e}}{\partial{d}}"></Katex>
        <Katex latex="\displaystyle \frac{\partial{e}}{\partial{b}} = \frac{\partial{c}}{\partial{b}} \cdot \frac{\partial{e}}{\partial{c}} + \frac{\partial{d}}{\partial{b}} \cdot \frac{\partial{e}}{\partial{d}}"></Katex>
        <Katex latex="\sum_i^k x_i"></Katex>
        <Katex latex="\displaystyle \sum_i^k x_i"></Katex>
        <Katex latex="\frac{\partial{e}}{\partial{x_i}}\unknown"></Katex>
        <span>
          please click
          <Link href="#">
            <Katex latex="\displaystyle \frac{\partial{e}}{\partial{c}}"></Katex>
          </Link>
          and
          <Link href="#">
            <Katex latex="\displaystyle \frac{\partial{e}}{\partial{d}}"></Katex>
          </Link>
        </span>
      </Stack>
    </>
  );
};

export default ExplainDerivativesPanel;
