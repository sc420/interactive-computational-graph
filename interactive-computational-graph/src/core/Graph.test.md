# Graph.test Documentation

## Small Graph

```mermaid
flowchart LR
    v1[v1=2] --> sum1[sum1=3]
    v2[v2=1] --> sum1
```

## Medium Graph

```mermaid
flowchart LR
    %% Layer 1
    v1[v1=2] --> sum1[sum1=3]
    v2[v2=1] --> sum1
    v2 --> sum2[sum2=2]
    c1[c1=1] --> sum2
    %% Layer 2
    sum1 --> product1[product1=30]
    sum2 --> product1
    v3[v3=5] --> product1
    %% Layer 3
    product1 --> identity1[identity1=30]
```

## Complex Graph

```mermaid
flowchart LR
    %% Layer 1
    v1[v1=2] --> sum1[sum1=3]
    v2[v2=1] --> sum1
    v2 --> sum2[sum2=2]
    c1[c1=1] --> sum2
    %% Layer 2
    v1 --> product1[product1=60]
    sum1 --> product1
    sum2 --> product1
    v3[v3=5] --> product1
    sum2 --> product2[product2=10]
    v3 --> product2
    %% Layer 3
    product2 --> identity1[identity1=10]
```

## Multi-Output Graph

This graph is used mostly in the comments.

```mermaid
flowchart LR
    %% Layer 1
    v3 --> op2
    v2 --> op2
    v2 --> op1
    v1 --> op1
    v4 --> op3
    %% Layer 2
    op2 --> op4
    op1 --> op4
    op3 --> op4
    op1 --> op5
    op3 --> op5
```

## Neural Network Graph

This fully connected neural network has the following traits:
- 2 inputs
- 1 hidden layer with 2 neurons and ReLU activation
- 1 output with sigmoid activation and MSE loss function

The notations:
- `i_{x}`: `x`-th input
- `{op}_{l}_{x}_{y}`: Operation `op` for layer `l` that connects `x`-th neuron in the current layer to `y`-th input/neuron in the previous layer
    - `{l}==h{n}`: `n`-th hidden layer
    - `{l}==o`: Output layer
    - `{op}==mul`: Multiplication function that multiplies `mul_{l}_{x}_{y}` in the current layer and `y`-th input/neuron in the previous layer
    - `{op}==sum`: Sum function that adds all `mul_{l}_{x}_{y}` for each `y` and bias `b_{l}_{x}`
    - `{op}==relu`: ReLU activation function for `sum_{l}_{x}`
    - `{op}==sigmoid`: Sigmoid activation function for `sum_l_x`
- `w_{l}_{x}_{y}`: Weight for operation `mul_{l}_{x}_{y}`
- `b_{l}_{x}`: Bias for operation `sum_{l}_{x}`
- `y_e`: The estimate `y` value
- `y`: The true `y` value
- `se`: Squared error function which outputs the loss (MSE with 1 sample data)

```mermaid
flowchart LR
    %% Input layer: Inputs
    i_1[i_1=0] --> mul_h1_1_1[mul_h1_1_1=0]
    i_2[i_2=1] --> mul_h1_1_2[mul_h1_1_2=-0.2]
    i_1 --> mul_h1_2_1[mul_h1_2_1=0]
    i_2 --> mul_h1_2_2[mul_h1_2_2=0.2]
    %% Hidden layer 1: Multiplication
    w_h1_1_1[w_h1_1_1=-0.1] --> mul_h1_1_1
    w_h1_1_2[w_h1_1_2=-0.2] --> mul_h1_1_2
    w_h1_2_1[w_h1_2_1=0.1] --> mul_h1_2_1
    w_h1_2_2[w_h1_2_2=0.2] --> mul_h1_2_2
    %% Hidden layer 1: Sum
    mul_h1_1_1 --> sum_h1_1[sum_h1_1=-0.5]
    mul_h1_1_2 --> sum_h1_1
    b_h1_1[b_h1_1=-0.3] --> sum_h1_1
    mul_h1_2_1 --> sum_h1_2[sum_h1_2=0.5]
    mul_h1_2_2 --> sum_h1_2
    b_h1_2[b_h1_2=0.3] --> sum_h1_2
    %% Hidden layer 1: Activation
    sum_h1_1 --> relu_h1_1[relu_h1_1=0]
    sum_h1_2 --> relu_h1_2[relu_h1_2=0.5]
    %% Hidden layer 1 activation values to output Layer
    relu_h1_1 --> mul_o_1_1[mul_o_1_1=0]
    relu_h1_2 --> mul_o_1_2[mul_o_1_2=0.25]
    %% Output layer: Multiplication
    w_o_1_1[w_o_1_1=-0.5] --> mul_o_1_1
    w_o_1_2[w_o_1_2=0.5] --> mul_o_1_2
    %% Output layer: Sum
    mul_o_1_1 --> sum_o_1[sum_o_1=0]
    mul_o_1_2 --> sum_o_1
    b_o_1[b_o_1=-0.25] --> sum_o_1
    %% Output layer: Activation
    sum_o_1 --> sigmoid_o_1[sigmoid_o_1=0.5]
    %% Output layer: Outputs (redundant for clarity)
    sigmoid_o_1 --> y_e[y_e=0.5]
    %% Loss function
    y_e --> se
    y[y=0] --> se
```
