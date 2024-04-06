import AddIcon from "@mui/icons-material/Add";
import HelpIcon from "@mui/icons-material/Help";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SchoolIcon from "@mui/icons-material/School";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useCallback, type FunctionComponent } from "react";
import type SelectedFeature from "../features/SelectedFeature";

interface FeatureNavigatorProps {
  isSidebarOpen: boolean;
  selectedItem: string | null;
  onItemClick: (item: SelectedFeature | null) => void;
}

interface FeatureItem {
  id: SelectedFeature;
  text: string;
  icon: JSX.Element;
}

const FeatureNavigator: FunctionComponent<FeatureNavigatorProps> = ({
  isSidebarOpen,
  selectedItem,
  onItemClick,
}) => {
  const featureItems: FeatureItem[] = [
    {
      id: "add-nodes",
      text: "Add Nodes",
      icon: <AddIcon />,
    },
    {
      id: "explain-derivatives",
      text: "Explain Derivatives",
      icon: <SchoolIcon />,
    },
    {
      id: "save-load",
      text: "Save/Load",
      icon: <ImportExportIcon />,
    },
    {
      id: "tutorial",
      text: "Tutorial",
      icon: <HelpIcon />,
    },
  ];

  const handleItemClick = useCallback(
    (id: SelectedFeature): void => {
      const newSelectedItem = id !== selectedItem ? id : null;
      onItemClick(newSelectedItem);
    },
    [onItemClick, selectedItem],
  );

  return (
    <List component="nav">
      {featureItems.map((item) =>
        isSidebarOpen ? (
          <ListItemButton
            key={item.id}
            selected={selectedItem === item.id}
            onClick={() => {
              handleItemClick(item.id);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ) : (
          <Tooltip key={item.id} title={item.text} placement="right">
            <ListItemButton
              selected={selectedItem === item.id}
              onClick={() => {
                handleItemClick(item.id);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Tooltip>
        ),
      )}
    </List>
  );
};

export default FeatureNavigator;
