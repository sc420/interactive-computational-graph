# Use Cases

## First Visit

1. User visits the website, should see an example computational graph
2. When the user visits the website for the first time, we should highlight the presets button so they can just see different kinds of computational graphs without modifying the graphs
3. User thinks it's enough, close the website

## Exploring

1. User starts to add some nodes to the example computational graph
2. User connects the new nodes with the existing computational graph, maybe also change some node values
3. User should observe the derivative values change
4. User moves the mouse over the derivative links to check how the values are calculated, we should show because it's chain rule
5. User loads some other computational graphs to mess around

## Build New Computational Graphs

1. User clears the example computational graph
2. User builds the new computational graph by constantly adding/deleting nodes
3. User may view the existing nodes in "View nodes" panel and click the node to highlight the node on the graph
4. User saves the computational graph to a file by clicking export in "Load/Save" panel
5. User keeps modifying the computational graph
6. User loads the previously exported computational graph

## Custom Nodes

1. User builds new custom operations in "Add nodes" panel
2. User saves the computational graph along with the custom operations to the file
3. User loads the file, we should also load the custom operations

## Understanding Neural Network

1. User wants to understand how neural networks work, so they build a network by using "Neural network builder" panel
2. User sees the new computational graph
3. User saves the computational graph as GraphViz dot file
