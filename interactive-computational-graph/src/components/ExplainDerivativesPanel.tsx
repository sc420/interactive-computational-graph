import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  List,
  Typography,
} from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";
import ExplainDerivativesListItem from "./ExplainDerivativeListItem";
import ExplainDerivativesHint from "./ExplainDerivativesHint";

interface ExplainDerivativesPanelProps {
  hasNodes: boolean;
  hasDerivativeTarget: boolean;
  explainDerivativeData: ExplainDerivativeData[];
  onClearSelection: () => void;
}

const ExplainDerivativesPanel: FunctionComponent<
  ExplainDerivativesPanelProps
> = ({
  hasNodes,
  hasDerivativeTarget,
  explainDerivativeData,
  onClearSelection,
}) => {
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
          <Typography variant="subtitle1">Explain Derivatives</Typography>
        </Grid>
        <Grid item>
          <Button startIcon={<ClearIcon />} onClick={onClearSelection}>
            Clear
          </Button>
        </Grid>
      </Grid>

      {/* Hint */}
      <ExplainDerivativesHint
        hasNodes={hasNodes}
        hasDerivativeTarget={hasDerivativeTarget}
        explainDerivativeData={explainDerivativeData}
      />

      {/* Explanations */}
      {explainDerivativeData.map((data) => (
        <Accordion key={data.nodeId} defaultExpanded disableGutters square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={getContentId(data.nodeId)}
            id={`explain-derivative-header-${data.nodeId}`}
          >
            <Typography variant="subtitle2">Node {data.nodeId}</Typography>
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
