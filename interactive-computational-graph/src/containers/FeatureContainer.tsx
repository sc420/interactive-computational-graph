import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import FeatureNavigator from '../components/FeatureNavigator'
import FeaturePanel from '../components/FeaturePanel'

const FeatureContainer: React.FunctionComponent = () => {
  return (
    <Box sx={{ border: 1 }}>
      <Grid container>
        <Grid>
          <FeatureNavigator></FeatureNavigator>
        </Grid>
        <Grid>
          <FeaturePanel></FeaturePanel>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FeatureContainer
