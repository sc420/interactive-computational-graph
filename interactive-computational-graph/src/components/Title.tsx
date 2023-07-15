import { AppBar, Link, Toolbar, Typography } from '@mui/material'

const Title: React.FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Interactive Computational Graph
        </Typography>
        <Link
          href="https://github.com/sc420/interactive-computational-graph"
          target="_blank"
          underline="none"
          color="inherit"
        >
          GitHub
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default Title
