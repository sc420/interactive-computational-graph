import type ExplainDerivativeItemType from "./ExplainDerivativeItemType";
import type MathLabelPartType from "./MathLabelPartType";

interface ExplainDerivativeItem {
  type: ExplainDerivativeItemType;
  descriptionParts: MathLabelPartType[];
  latex: string;
}

export default ExplainDerivativeItem;
