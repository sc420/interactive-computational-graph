import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Container, CssBaseline, Divider, Grid, IconButton, List, Toolbar, Typography } from '@mui/material'
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import React from 'react'
import FeatureNavigator from './components/FeatureNavigator'
import GraphContainer from './containers/GraphContainer'
import FeaturePanel from './components/FeaturePanel'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

// Reference: https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...((open === true) && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

// Reference: https://github.com/mui/material-ui/tree/v5.14.0/docs/data/material/getting-started/templates/dashboard
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      ...((open === false) && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
)

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
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px' // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Interactive Computational Graph
          </Typography>
          <IconButton color="inherit">
            GitHub
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <FeatureNavigator selectedItem={selectedFeature} onItemClick={toggleFeature} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
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
