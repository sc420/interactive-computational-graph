import AddIcon from "@mui/icons-material/Add";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListIcon from "@mui/icons-material/List";
import SchoolIcon from "@mui/icons-material/School";
import TimelineIcon from "@mui/icons-material/Timeline";
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
      id: "view-nodes",
      text: "View Nodes",
      icon: <ListIcon />,
    },
    {
      id: "explain-derivatives",
      text: "Explain Derivatives",
      icon: <SchoolIcon />,
    },
    {
      id: "network-builder",
      text: "Network Builder",
      icon: <TimelineIcon />,
    },
    {
      id: "examples",
      text: "Examples",
      icon: <EmojiObjectsIcon />,
    },
    {
      id: "load-save",
      text: "Load/Save",
      icon: <ImportExportIcon />,
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
