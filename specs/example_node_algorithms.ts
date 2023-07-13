class GraphNode {
    id: string = "";
    value: number = 0;
    inputPorts: Port[] = [];
    outputPort: Port = new Port();
    portToNodes: Map<string, GraphNode[]> = new Map();
    f: () => number = () => NaN;
    derivativeFOverDerivativeY: (x: GraphNode) => number = () => 0;

    getInputNode(portName: string): GraphNode {
        const nodes = this.getInputNodes(portName);
        if (nodes.length !== 1) {
            throw new Error(`Should only have 1 node, but the port has ${nodes.length} nodes`);
        }
        return nodes[0];
    }

    getInputNodes(portName: string): GraphNode[] {
        const nodes = this.portToNodes.get(portName);
        if (nodes === undefined) {
            throw new Error(`Couldn't get the input nodes on port ${portName}`);
        }
        return nodes;
    }

    getOutputNodes(): GraphNode[] {
        const nodes = this.portToNodes.get(this.outputPort.name);
        if (nodes === undefined) {
            throw new Error(`Couldn't get the output nodes on port ${this.outputPort.name}`);
        }
        return nodes;
    }

    hasInputNode(portName: string, nodeId: string): boolean {
        const nodes = this.getInputNodes(portName);
        return nodes.some((node) => node.id == nodeId);
    }
}

class Port {
    name: string = "";
    allowMultiEdges: boolean = false;
}

class SumNode extends GraphNode {
    readonly PORT_INPUTS = "inputs"; 

    constructor() {
        super();
        this.f = (): number => {
            let sum = 0;
            this.getInputNodes(this.PORT_INPUTS).forEach((node) => {
                sum += node.value;
            });
            return sum;
        };
        this.derivativeFOverDerivativeY = (y: GraphNode): number => {
            // f = a + b + y + c + d
            if (y.id === this.id) return 1; // df/df = 1
            if (!this.hasInputNode(this.PORT_INPUTS, y.id)) return 0;
            return 1; // df/dy = 1
        };
    }
}

class MultiplyNode extends GraphNode {
    readonly PORT_INPUTS = "inputs"; 

    constructor() {
        super();
        this.f = (): number => {
            let product = 1;
            this.getInputNodes(this.PORT_INPUTS).forEach((node) => {
                product *= node.value;
            });
            return product;
        };
        this.derivativeFOverDerivativeY = (y: GraphNode): number => {
            // f = a * b * y * c * d
            if (y.id === this.id) return 1;  // df/df = 1
            if (!this.hasInputNode(this.PORT_INPUTS, y.id)) return 0;
            // df/dy = a * b * c * d
            let product = 1;
            this.getInputNodes(this.PORT_INPUTS).forEach((node) => {
                if (node.id === y.id) {
                    return;
                }
                product *= node.value;
            });
            return product;
        };
    }
}

class PowerNode extends GraphNode {
    readonly PORT_X = "x";
    readonly PORT_N = "n";

    constructor() {
        super();
        this.f = (): number => {
            const x = this.getInputNode(this.PORT_X).value;
            const n = this.getInputNode(this.PORT_N).value;
            return Math.pow(x, n);
        };
        this.derivativeFOverDerivativeY = (y: GraphNode): number => {
            // f = x^n
            if (y.id === this.id) return 1;  // df/df = 1
            
            const nodeX = this.getInputNode(this.PORT_X);
            const nodeN = this.getInputNode(this.PORT_N);
            const x = nodeX.value;
            const n = nodeN.value;
            if (y.id === nodeX.id) {
                // df/dx = n*x^(n-1)
                return n * Math.pow(x, n - 1);
            } else if (y.id === nodeN.id) {
                // df/dn = x^n * log(x)
                return Math.pow(x, n) * Math.log(x);
            } else {
                return 0;
            }
        };
    }
}

class SigmoidNode extends GraphNode {
    readonly PORT_X = "x";

    constructor() {
        super();
        this.f = (): number => {
            const x = this.getInputNode(this.PORT_X).value;
            return 1 / (1 + Math.exp(-x));
        };
        this.derivativeFOverDerivativeY = (x: GraphNode): number => {
            // f = 1 / (1 + e^(-x))
            if (x.id === this.id) return 1;  // df/df = 1
            if (!this.hasInputNode(this.PORT_X, x.id)) return 0;
            
            // df = f * (1 - f)
            return this.f() * (1 - this.f());
        };
    }
}
