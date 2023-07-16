import { Box, CssBaseline } from '@mui/material'
import React from 'react'
import FeatureNavigator from './components/FeatureNavigator'
import Sidebar from './components/Sidebar'
import Title from './components/Title'
import MainContainer from './containers/MainContainer'

const App: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(true)
  const [selectedFeature, setSelectedFeature] = React.useState<string | null>('dashboard')

  const toggleDrawer = (): void => {
    setOpen(!open)
  }

  const toggleFeature = (feature: string | null): void => {
    setSelectedFeature(feature)
  }

  return (
    <Box display="flex">
      <CssBaseline />
      {/* Title */}
      <Title isSidebarOpen={open} onToggleSidebar={toggleDrawer} />
      {/* Sidebar */}
      <Sidebar isSidebarOpen={open} onToggleSidebar={toggleDrawer}>
        <FeatureNavigator selectedItem={selectedFeature} onItemClick={toggleFeature} />
      </Sidebar>
      {/* Main */}
      <MainContainer selectedFeature={selectedFeature} />
    </Box>
  )
}

export default App
