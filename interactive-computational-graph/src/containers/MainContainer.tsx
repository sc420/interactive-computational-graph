import { Box, Container, Grid, Toolbar } from '@mui/material'
import PropTypes from 'prop-types'
import FeaturePanel from '../components/FeaturePanel'
import GraphContainer from './GraphContainer'

interface MainContainerProps {
  selectedFeature: string | null
}

const MainContainer: React.FunctionComponent<MainContainerProps> = ({ selectedFeature }) => {
  return (
    <Box component="main" flexGrow={1} height="100vh" overflow="hidden">
      <Toolbar />
      <Container disableGutters maxWidth={false} sx={{ height: '100%', position: 'relative' }}>
        <Grid container direction="row" height="100%">
          {/* Feature panel */}
          {selectedFeature !== null &&
            <Grid item borderRight="1px solid" borderColor="divider">
              <FeaturePanel feature={selectedFeature} />
            </Grid>
          }
          {/* Graph container */}
          <Grid item flexGrow={1}>
            <GraphContainer />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

MainContainer.propTypes = {
  selectedFeature: PropTypes.string.isRequired
}

export default MainContainer
