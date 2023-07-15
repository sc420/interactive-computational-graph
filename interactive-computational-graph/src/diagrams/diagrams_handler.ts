import createEngine, { type DiagramEngine, DiagramModel, DefaultNodeModel, type DefaultLinkModel } from '@projectstorm/react-diagrams'

class DiagramsHandler {
  engine: DiagramEngine
  model: DiagramModel

  constructor () {
    this.engine = createEngine()
    this.model = new DiagramModel()
    this.engine.setModel(this.model)

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
    node2.addOutPort('Out')

    // Link them and add a label to the link
    const link = port1.link<DefaultLinkModel>(port2)

    this.model.addAll(node1, node2, link)
  }

  getEngine (): DiagramEngine {
    return this.engine
  }

  getModel (): DiagramModel {
    return this.model
  }

  addNode (): void { // TODO(sc420): Remove this test function
    // Create a new node
    const node = new DefaultNodeModel({ name: 'New Node', color: 'rgb(0,192,255)' })
    node.setPosition(300, 300)

    // Add the node to the diagram model
    this.model.addNode(node)
  }

  repaint (): void {
    this.engine.repaintCanvas()
  }
}

export default DiagramsHandler
