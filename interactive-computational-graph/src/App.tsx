import { Box, Container, CssBaseline, Grid, Toolbar } from '@mui/material'
import React from 'react'
import FeatureNavigator from './components/FeatureNavigator'
import FeaturePanel from './components/FeaturePanel'
import Sidebar from './components/Sidebar'
import Title from './components/Title'
import GraphContainer from './containers/GraphContainer'

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
      <Title isSidebarOpen={open} onToggleSidebar={toggleDrawer} />
      <Sidebar isSidebarOpen={open} onToggleSidebar={toggleDrawer}>
        <FeatureNavigator selectedItem={selectedFeature} onItemClick={toggleFeature} />
      </Sidebar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <Toolbar />
        <Container disableGutters maxWidth={false} sx={{ height: '100%', position: 'relative' }}>
          <Grid container direction="row" height="100%">
            {selectedFeature !== null &&
              <Grid item borderRight="1px solid" borderColor="divider">
                <FeaturePanel feature={selectedFeature} />
              </Grid>
            }
            <Grid item flexGrow={1}>
              <GraphContainer />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default App
