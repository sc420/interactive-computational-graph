import { Alert } from "@mui/material";
import { useCallback, type FunctionComponent } from "react";

interface ExplainDerivativesHintProps {
  hasNodes: boolean;
  hasDerivativeTarget: boolean;
  hasExplainDerivativeData: boolean;
}

const ExplainDerivativesHint: FunctionComponent<
  ExplainDerivativesHintProps
> = ({ hasNodes, hasDerivativeTarget, hasExplainDerivativeData }) => {
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
      {!hasExplainDerivativeData && (
        <Alert severity="info">{getHintText()}</Alert>
      )}
    </>
  );
};

export default ExplainDerivativesHint;
