# Interactive Computational Graph

A small educational React website to understand how backpropagation and chain rule work in neural networks.

Classic calculus problem $\frac{\sin{x}}{x}$:

![screenshot 1](./screenshots/screenshot1.png "Screenshot 1")

2-1 fully connected neural network:

![screenshot 2](./screenshots/screenshot2.png "Screenshot 2")

## Demo

[Interactive Computational Graph](https://sc420.github.io/interactive-computational-graph/)

## Features

- Show how derivatives are calculated in any scalar conputational graph
- Customizable operators
- Can save/load the graph to/from file

For simplicity, the built-in operators and how derivatives are accumulated are limited to scalar values, but the architectural design is open to handle higher-dimensional values.

## Development

VSCode can be used to develop the website.

If you use VSCode, please open the subdirectory `./interactive-computational-graph` in a new Window and enable the extensions like ESLint in the new window. Otherwise, we have to set up some extra settings if we open a VSCode window here.

### Recommended VSCode Extensions

- Jest: Runs Jest tests
- Code Spell Checker: Checks common spelling errors
- ESLint: Lints Typescript files
- Stylelint: Lints CSS files
- Prettier: Formats Typescript files
- Markdown Preview Mermaid Support: Previews Mermaid graphs in Markdown files
