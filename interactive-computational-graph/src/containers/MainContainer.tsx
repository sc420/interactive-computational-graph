import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import FeatureContainer from './FeatureContainer'
import GraphContainer from './GraphContainer'

const MainContainer: React.FunctionComponent = () => {
  return (
    <Box sx={{ border: 1, flexGrow: 1 }}>
      <Container maxWidth={false} sx={{ flexGrow: 1 }} disableGutters>
        <Grid container>
          <Grid>
            <FeatureContainer></FeatureContainer>
          </Grid>
          <Grid>
            <GraphContainer></GraphContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default MainContainer
