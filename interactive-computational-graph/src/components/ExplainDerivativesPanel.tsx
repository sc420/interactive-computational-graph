import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  List,
  Typography,
} from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import ExplainDerivativesListItem from "./ExplainDerivativeListItem";

interface ExplainDerivativesPanelProps {
  explainDerivativeData: ExplainDerivativeData[];
}

const ExplainDerivativesPanel: FunctionComponent<
  ExplainDerivativesPanelProps
> = ({ explainDerivativeData }) => {
  const getContentId = useCallback((nodeId: string) => {
    return `explain-derivative-content-${nodeId}`;
  }, []);

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

      {/* Explanations */}
      {explainDerivativeData.map((data) => (
        <Accordion key={data.nodeId} defaultExpanded disableGutters square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={getContentId(data.nodeId)}
            id={`explain-derivative-header-${data.nodeId}`}
          >
            <Typography variant="subtitle2">{data.nodeId}</Typography>
          </AccordionSummary>
          <AccordionDetails
            id={getContentId(data.nodeId)}
            sx={{ px: 2, py: 1 }}
          >
            <List disablePadding>
              {data.items.map((item, index) => (
                <ExplainDerivativesListItem
                  key={item.type}
                  item={item}
                  hasDivider={index !== data.items.length - 1}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default ExplainDerivativesPanel;
