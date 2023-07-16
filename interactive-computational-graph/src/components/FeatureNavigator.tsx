import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LayersIcon from '@mui/icons-material/Layers'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

interface FeatureNavigatorProps {
  selectedItem: string | null
  onItemClick: (item: string | null) => void
}

interface FeatureItem {
  id: string
  text: string
  icon: JSX.Element
}

const FeatureNavigator: React.FunctionComponent<FeatureNavigatorProps> = ({ selectedItem, onItemClick }) => {
  const featureItems: FeatureItem[] = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'orders', text: 'Orders', icon: <ShoppingCartIcon /> },
    { id: 'customers', text: 'Customers', icon: <PeopleIcon /> },
    { id: 'reports', text: 'Reports', icon: <BarChartIcon /> },
    { id: 'integrations', text: 'Integrations', icon: <LayersIcon /> }
  ]

  const handleItemClick = (id: string): void => {
    const newSelectedItem = (id !== selectedItem) ? id : null
    onItemClick(newSelectedItem)
  }

  return (
    <React.Fragment>
      {featureItems.map((item) => (
        <ListItemButton
          key={item.id}
          selected={selectedItem === item.id}
          onClick={() => { handleItemClick(item.id) }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.id} />
        </ListItemButton>
      ))}
    </React.Fragment>
  )
}

export default FeatureNavigator
