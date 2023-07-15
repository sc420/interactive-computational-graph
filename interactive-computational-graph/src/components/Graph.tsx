import { Box } from '@mui/material'
import createEngine, { CanvasWidget, DefaultNodeModel, DiagramModel, type DefaultLinkModel } from '@projectstorm/react-diagrams'

const Graph: React.FunctionComponent = () => {
  // Create an instance of the engine
  const engine = createEngine()

  // Create a diagram model
  const model = new DiagramModel()

  // node 1
  const node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)'
  })
  node1.setPosition(100, 100)
  const port1 = node1.addOutPort('Out')

  // node 2
  const node2 = new DefaultNodeModel({
    name: 'Node 2',
    color: 'rgb(0,192,255)'
  })
  node2.setPosition(200, 100)
  const port2 = node2.addInPort('In')

  // Link them and add a label to the link
  const link = port1.link<DefaultLinkModel>(port2)

  model.addAll(node1, node2, link)

  engine.setModel(model)

  console.log('Engine initialized')

  return (
    <Box
      sx={{
        backgroundColor: 'lightgray',
        height: '100%',
        '> *': { height: '100%', width: '100%' }
      }}
    >
      <CanvasWidget engine={engine} />
    </Box >
  )
}

export default Graph
