import { type FunctionComponent } from "react";

interface EditOperationTabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

const EditOperationTabPanel: FunctionComponent<EditOperationTabPanelProps> = ({
  index,
  value,
  children,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`edit-operation-tabpanel-${index}`}
      aria-labelledby={`edit-operation-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};

export default EditOperationTabPanel;
