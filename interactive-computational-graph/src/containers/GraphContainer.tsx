import { Grid } from '@mui/material'
import Graph from '../components/Graph'
import GraphControl from '../components/GraphControl'

const GraphContainer: React.FunctionComponent = () => {
  return (
    <Grid container direction="column" height="100%">
      {/* Graph control */}
      <Grid item>
        <GraphControl />
      </Grid>
      {/* Graph */}
      <Grid item flexGrow={1}>
        <Graph />
      </Grid>
    </Grid>
  )
}

export default GraphContainer
