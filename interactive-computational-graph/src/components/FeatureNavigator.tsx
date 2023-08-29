import AddIcon from "@mui/icons-material/Add";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListIcon from "@mui/icons-material/List";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type FunctionComponent } from "react";
import type SelectedFeature from "../features/SelectedFeature";

interface FeatureNavigatorProps {
  selectedItem: string | null;
  onItemClick: (item: SelectedFeature | null) => void;
}

interface FeatureItem {
  id: SelectedFeature;
  text: string;
  icon: JSX.Element;
}

const FeatureNavigator: FunctionComponent<FeatureNavigatorProps> = ({
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

  const handleItemClick = (id: SelectedFeature): void => {
    const newSelectedItem = id !== selectedItem ? id : null;
    onItemClick(newSelectedItem);
  };

  return (
    <List component="nav">
      {featureItems.map((item) => (
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
      ))}
    </List>
  );
};

export default FeatureNavigator;
