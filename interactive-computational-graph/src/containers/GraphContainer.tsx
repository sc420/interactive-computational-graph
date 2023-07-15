import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Graph from '../components/Graph'
import GraphControl from '../components/GraphControl'

const GraphContainer: React.FunctionComponent = () => {
  return (
    <Box sx={{ border: 1 }}>
      <Grid container alignItems="stretch">
        <Grid display="flex" width="100%">
          <GraphControl></GraphControl>
        </Grid>
      </Grid>
      <Grid container alignItems="stretch">
        <Grid display="flex" width="100%">
          <Graph></Graph>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GraphContainer
