import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import type React from "react";
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

const FeatureNavigator: React.FunctionComponent<FeatureNavigatorProps> = ({
  selectedItem,
  onItemClick,
}) => {
  const featureItems: FeatureItem[] = [
    { id: "dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { id: "orders", text: "Orders", icon: <ShoppingCartIcon /> },
    { id: "customers", text: "Customers", icon: <PeopleIcon /> },
    { id: "reports", text: "Reports", icon: <BarChartIcon /> },
    { id: "integrations", text: "Integrations", icon: <LayersIcon /> },
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
          <ListItemText primary={item.id} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default FeatureNavigator;
