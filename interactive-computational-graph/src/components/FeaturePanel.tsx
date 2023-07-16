import { Box } from '@mui/material'
import PropTypes from 'prop-types'

interface FeaturePanelProps {
  feature: string
}

const FeaturePanel: React.FunctionComponent<FeaturePanelProps> = ({ feature }) => {
  return (
    <Box sx={{ width: 250 }}>
      FeaturePanel {feature}
    </Box>
  )
}

FeaturePanel.propTypes = {
  feature: PropTypes.string.isRequired
}

export default FeaturePanel
