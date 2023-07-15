import { Box } from '@mui/material'
import Graph from '../components/Graph'
// import GraphControl from '../components/GraphControl'

const GraphContainer: React.FunctionComponent = () => {
  return (
    <Box display="flex" flexGrow={1}>
      {/* <GraphControl></GraphControl> */}
      <Graph></Graph>
      {/* <Grid container alignItems="stretch">
        <Grid width="100%">
          <GraphControl></GraphControl>
        </Grid>
      </Grid>
      <Grid container alignItems="stretch" sx={{ border: 1 }}>
        <Grid>
          <Graph></Graph>
        </Grid>
      </Grid> */}
    </Box>
  )
}

export default GraphContainer
