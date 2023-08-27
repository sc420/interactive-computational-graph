import type OutputItemType from "./OutputItemType";

interface OutputItem {
  type: OutputItemType;
  text: string;
  value: string;
}

export default OutputItem;
