import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  useCallback,
  useState,
  type FunctionComponent,
  type MouseEvent,
} from "react";

interface EditOperationDialogMenuProps {
  onDelete: () => void;
}

const EditOperationDialogMenu: FunctionComponent<
  EditOperationDialogMenuProps
> = ({ onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <IconButton
        aria-label="more"
        id="edit-operation-menu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "edit-operation-menu-button",
        }}
      >
        <MenuItem
          onClick={() => {
            onDelete();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Operation</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default EditOperationDialogMenu;
