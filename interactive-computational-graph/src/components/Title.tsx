import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, Toolbar, Typography } from '@mui/material'
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import type React from 'react'
import { TITLE_HEIGHT, SIDEBAR_EXPANDED_WIDTH } from '../constants'

interface TitleProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

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
  height: `${TITLE_HEIGHT}px`, // make it the same height regardless of the screen width
  ...((open === true) && {
    marginLeft: SIDEBAR_EXPANDED_WIDTH,
    width: `calc(100% - ${SIDEBAR_EXPANDED_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Title: React.FunctionComponent<TitleProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <AppBar position="absolute" open={isSidebarOpen}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
          minHeight: `${TITLE_HEIGHT}px !important` // keep the typography at the center vertically
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          sx={{
            marginRight: '36px',
            ...(isSidebarOpen && { display: 'none' })
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
  )
}

export default Title
