import { Alert } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type ExplainDerivativeData from "../features/ExplainDerivativeData";

interface ExplainDerivativesHintProps {
  hasNodes: boolean;
  hasDerivativeTarget: boolean;
  explainDerivativeData: ExplainDerivativeData[];
}

const ExplainDerivativesHint: FunctionComponent<
  ExplainDerivativesHintProps
> = ({ hasNodes, hasDerivativeTarget, explainDerivativeData }) => {
  const getHintText = useCallback(() => {
    if (hasNodes) {
      if (hasDerivativeTarget) {
        return "Select some node(s) to see the explanations";
      } else {
        return "Set the derivative target to see the explanations";
      }
    } else {
      return "Add some node(s) and select them to see the explanations";
    }
  }, [hasDerivativeTarget, hasNodes]);

  return (
    <>
      {/* Hints */}
      {explainDerivativeData.length === 0 && (
        <Alert severity="info">{getHintText()}</Alert>
      )}
    </>
  );
};

export default ExplainDerivativesHint;
