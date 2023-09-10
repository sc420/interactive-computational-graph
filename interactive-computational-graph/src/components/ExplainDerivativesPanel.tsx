import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Grid,
  List,
  Snackbar,
  Typography,
  type AlertColor,
} from "@mui/material";
import {
  useCallback,
  useState,
  type FunctionComponent,
  type SyntheticEvent,
} from "react";
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
  const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const getContentId = useCallback((nodeId: string) => {
    return `explain-derivative-content-${nodeId}`;
  }, []);

  const handleCopyLatex = useCallback((latex: string): void => {
    window.navigator.clipboard
      .writeText(latex)
      .then(() => {
        setAlertSeverity("success");
        setAlertMessage("Copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Unable to copy to clipboard: ", error);
        setAlertSeverity("error");
        setAlertMessage("Unable to copy to clipboard, see console for details");
        setSnackbarOpen(true);
      });
  }, []);

  const handleSnackbarClose = useCallback(
    (event?: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setSnackbarOpen(false);
    },
    [],
  );

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
                  onCopyLatex={handleCopyLatex}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Error message */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExplainDerivativesPanel;
