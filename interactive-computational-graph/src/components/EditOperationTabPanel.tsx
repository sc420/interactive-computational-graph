import { Box } from "@mui/material";
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
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
};

export default EditOperationTabPanel;
