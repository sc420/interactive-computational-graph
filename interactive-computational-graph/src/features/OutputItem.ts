import type MathLabelPartType from "./MathLabelPartType";
import type OutputItemType from "./OutputItemType";

interface OutputItem {
  type: OutputItemType;
  labelParts: MathLabelPartType[];
  value: string;
}

export default OutputItem;
