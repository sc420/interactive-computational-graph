import type ExplainDerivativeDescriptionType from "./ExplainDerivativeDescriptionType";
import type ExplainDerivativeItemType from "./ExplainDerivativeItemType";

interface ExplainDerivativeItem {
  type: ExplainDerivativeItemType;
  descriptionParts: ExplainDerivativeDescriptionType[];
  latex: string;
}

export default ExplainDerivativeItem;
