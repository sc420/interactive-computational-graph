import { Box, Button } from '@mui/material'
import { CanvasWidget } from '@projectstorm/react-diagrams'
import React from 'react'
import DiagramsHandler from '../diagrams/diagrams_handler'

const Graph: React.FunctionComponent = () => {
  const diagramsHandlerRef: React.MutableRefObject<DiagramsHandler | null> = React.useRef(null)
  const [isDiagramsReady, setDiagramsReady] = React.useState(false)

  React.useEffect(() => {
    diagramsHandlerRef.current = new DiagramsHandler()
    setDiagramsReady(true)
  }, [])

  const handleAddNode = (): void => {
    const diagramsHandle = diagramsHandlerRef.current
    if (diagramsHandle === null) {
      return
    }

    diagramsHandle.addNode()
    diagramsHandle.repaint()
  }

  // TODO(sc420): Remove the "Add Node" Button
  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleAddNode} sx={{ width: 100, height: 50 }}>Add Node</Button>
      <Box
        display="flex"
        flexGrow={1}
        sx={{
          backgroundColor: 'lightgray',
          '> *': { flexGrow: 1 }
        }}
      >
        {isDiagramsReady &&
          diagramsHandlerRef.current !== null &&
          <CanvasWidget engine={diagramsHandlerRef.current.getEngine()} />}
      </Box >
    </React.Fragment>
  )
}

export default Graph
