# Functional Spec

## Major Features

- Let people build any computational graph by using variables and operations as the components
- Calculate derivative $ \frac{\partial{y'}}{\partial{v}} $ for each variable $ v $ for the last node $ y' $

## Nice-To-Have Features

- Can build the graph by drag-and-dropping
- Can show the variable names in LaTeX
- Can fill in the variable values so that we can actually calculate forward-pass and differentiation values
- Can randomize the values
- Can select any node as the differentiation target rather than just the last node $ y' $ (also means that the graph allows multiple outputs)
- Show how the derivative is calculated by showing the chain rule (e.g., $ \frac{\partial{e}}{\partial{a}} = \frac{\partial{(c)}}{\partial{a}} * \frac{\partial{e}}{\partial{(c)}} = 1.2 * d = 2.4 $)
- Show the expression of a node (e.g., $ e = c * d $)
- Fully connected neural network builder
- Load/save the graph from/to a file

## Advanced Features

- Highlight the path from the target node to the selected node to show how chain rule works
- Show both forward-mode and reverse-mode differentiation
- Can customize the operations: Define more operations and specify how to differentiate (e.g., with custom JavaScript code)

## References

- [Calculus on Computational Graphs: Backpropagation - Christopher Olah](https://colah.github.io/posts/2015-08-Backprop/)
- [How Computational Graphs are Constructed in PyTorch](https://pytorch.org/blog/computational-graphs-constructed-in-pytorch/)
- [#004 PyTorch – Computational graph and Autograd with Pytorch - Strahinja Zivkovic](https://datahacker.rs/004-computational-graph-and-autograd-with-pytorch/)
- [Computing Gradient - Hung-yi Lee](https://speech.ee.ntu.edu.tw/~tlkagk/courses/MLDS_2018/Lecture/Graph.pdf)
