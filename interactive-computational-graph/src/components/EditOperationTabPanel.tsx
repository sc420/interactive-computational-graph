import { Box } from "@mui/material";
import { type FunctionComponent } from "react";

interface EditOperationDialogProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

const EditOperationDialog: FunctionComponent<EditOperationDialogProps> = ({
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

export default EditOperationDialog;
