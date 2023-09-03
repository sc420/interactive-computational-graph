import { Box, Grid, List, ListItem, Typography } from "@mui/material";
import { type FunctionComponent } from "react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import Katex from "../latex/katex";

interface ExplainDerivativesPanelProps {
  explainDerivativeData: ExplainDerivativeData[];
}

const ExplainDerivativesPanel: FunctionComponent<
  ExplainDerivativesPanelProps
> = ({ explainDerivativeData }) => (
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

    {/* Explanations */}
    <List>
      {explainDerivativeData.map((data) => (
        <ListItem key={data.nodeId}>
          <Box>
            <Typography>{data.nodeId}</Typography>
            <List>
              {data.items.map((item, index) => (
                <Box key={index}>
                  <Typography>
                    {JSON.stringify(item.descriptionParts)}
                  </Typography>
                  <Katex latex={item.latex} />
                </Box>
              ))}
            </List>
          </Box>
        </ListItem>
      ))}
    </List>
  </>
);

export default ExplainDerivativesPanel;
