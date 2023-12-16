import { Button } from "@mui/material";
import { type FunctionComponent } from "react";

interface EditOperationDialogMenuProps {
  onDelete: () => void;
}

const EditOperationDialogMenu: FunctionComponent<
  EditOperationDialogMenuProps
> = ({ onDelete }) => {
  return (
    <Button
      aria-label="Delete operation"
      onClick={() => {
        onDelete();
      }}
    ></Button>
  );
};

export default EditOperationDialogMenu;
