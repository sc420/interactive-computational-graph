import type DifferentiationMode from "./DifferentiationMode";
import type GraphNode from "./GraphNode";

type TopologicalSortDirection = "TO_OUTPUT" | "TO_INPUT";

interface TopologicalSortCallStackElement {
  nodeId: string;
  allDependentsVisited: boolean;
}

class Graph {
  private readonly nodeIdToNodes = new Map<string, GraphNode>();

  private differentiationMode: DifferentiationMode = "REVERSE";

  private targetNodeId: string | null = null;

  /**
   * Records the valid derivatives for all the nodes that are propagated from
   * the current target node. For forward mode, it propagates from left to
   * right. For reverse mode, it propagates from right to left.
   */
  private readonly nodeIdToDerivatives = new Map<string, number>();

  getNodes(): GraphNode[] {
    return Array.from(this.nodeIdToNodes.values());
  }

  getOneNode(nodeId: string): GraphNode {
    const node = this.nodeIdToNodes.get(nodeId);
    if (node === undefined) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
    return node;
  }

  hasNode(nodeId: string): boolean {
    return this.nodeIdToNodes.has(nodeId);
  }

  addNode(node: GraphNode): void {
    const nodeId = node.getId();
    if (this.hasNode(nodeId)) {
      throw new Error(`Node ${nodeId} already exists`);
    }
    this.nodeIdToNodes.set(node.getId(), node);
  }

  removeNode(nodeId: string): void {
    const success = this.nodeIdToNodes.delete(nodeId);
    if (!success) {
      throw new Error(`Node ${nodeId} doesn't exist`);
    }
  }

  connect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
    node1.getRelationship().addOutputNode(node2);
    node2.getRelationship().addInputNodeByPort(node2PortId, node1);
  }

  disconnect(node1Id: string, node2Id: string, node2PortId: string): void {
    const node1 = this.getOneNode(node1Id);
    const node2 = this.getOneNode(node2Id);
    node1.getRelationship().removeOutputNode(node2Id);
    node2.getRelationship().removeInputNodeByPort(node2PortId, node1Id);
  }

  setDifferentiationMode(mode: DifferentiationMode): void {
    this.differentiationMode = mode;
  }

  getNodeValue(nodeId: string): number {
    const node = this.getOneNode(nodeId);
    return node.getValue();
  }

  getNodeDerivative(nodeId: string): number {
    const derivative = this.nodeIdToDerivatives.get(nodeId);
    if (derivative === undefined) {
      return 0;
    }
    return derivative;
  }

  setNodeValue(nodeId: string, value: number): void {
    const node = this.getOneNode(nodeId);
    node.setValue(value);
  }

  getTargetNode(): string | null {
    return this.targetNodeId;
  }

  setTargetNode(nodeId: string | null): void {
    if (nodeId !== null) {
      this.getOneNode(nodeId); // checks if the node exists
    }

    this.targetNodeId = nodeId;
  }

  /**
   * Update all f() values.
   *
   * We can use the following graph as an example:
   * - op4=f(op1(),op2(),op3())
   * - op5=f(op1(),op3())
   * - op1=f(v1,v2)
   * - op2=f(v2,v3)
   * - op3=v4
   *
   * The algorithm runs as follows:
   * 1. Find all terminal nodes like op4 and op5
   * 2. Perform a topological sort to find nodes in reverse order, a valid
   *    order could be [v1,v2,v3,v4,op1,op2,op3,op4,op5] or
   *    [v4,v3,v2,v1,op3,op2,op1,op5,op4]
   * 3. Update f() for nodes in the reverse topological order
   *
   * @returns Node IDs of all nodes that have their f() updated.
   */
  updateFValues(): Set<string> {
    const terminalNodeIds = this.getTerminalNodeIds();
    const topologicalOrderedNodeIds = this.topologicalSort(
      terminalNodeIds,
      "TO_INPUT",
    );
    const updatedNodeIds = new Set<string>();
    topologicalOrderedNodeIds.forEach((nodeId) => {
      const node = this.getOneNode(nodeId);
      node.updateF();
      updatedNodeIds.add(nodeId);
    });
    return updatedNodeIds;
  }

  /**
   * Perform a topological sort on the graph.
   *
   * We use DFS variant of the topological sort algorithm on wiki. Since the
   * graph is acyclic, we can ignore temporary marks. The recursive algorithm
   * can be written as follows:
   *
   * L ← Empty list that will contain the sorted nodes
   * while exists nodes without a permanent mark do // (1)
   *     select an unmarked node n
   *     visit(n) // (2)
   *
   * function visit(node n)
   *     if n has a permanent mark then // (3)
   *         return
   *
   *     for each node m with an edge from n to m do // (4)
   *         visit(m)
   *
   *     mark n with a permanent mark // (5)
   *     add n to head of L // (6)
   *
   * We can maintain our own call stack to simulate the recursion in the above
   * code. Each element in the call stack stores (n, allDependentsVisited) to
   * represent the position in the above recursive algorithm. We have another
   * set visitedNodes to record nodes that have reached the position (5).
   *
   * Initially, all nodes in startNodes are added to the call stack with
   * allDependentsVisited set to false. It represents the positions (1) and
   * (2). Other nodes not in startNodes are the nodes we don't care about, so
   * we don't need to call visit() on them.
   *
   * Instead of checking if the node is in the set visitedNodes when we pop an
   * element from the call stack, we move the check earlier when we call
   * visit() recursively in position (4).
   *
   * Then, we iterate through all dependent nodes of node n by the topological
   * sort direction. We add these dependent nodes to the call stack with
   * allDependentsVisited set to false initially just like startNodes. It
   * should not be confused with differentiation mode. It represents the
   * position (4). To make sure we know the node has reached position (5)
   * later, we push (n, allDependentsVisited==true) to the call stack before
   * adding dependent nodes.
   *
   * Later, when we pop an element from the stack and see that
   * allDependentsVisited is true, we add the node n to the set visitedNodes
   * and output the node n to the list L. It represents the positions (5) and
   * (6).
   *
   * NOTE: The results is reversed because prepend operation for array is O(n),
   * but append operation is amortized O(1) which is more efficient. If you
   * want it in the classic order, just reverse the list.
   *
   * References:
   * - https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
   *
   * @param startNodes List of starting nodes (unmarked nodes).
   *
   * @returns List of Node IDs in reverse topological order.
   */
  private topologicalSort(
    startNodeIds: string[],
    direction: TopologicalSortDirection,
  ): string[] {
    const callStack: TopologicalSortCallStackElement[] = [];
    // Call visit() for the root nodes (not depending on other nodes) (1) (2)
    startNodeIds.forEach((startNodeId) => {
      callStack.push({
        nodeId: startNodeId,
        allDependentsVisited: false,
      });
    });

    const visitedNodeIds = new Set<string>();
    const reverseResult: string[] = [];
    while (callStack.length > 0) {
      const callStackElem = callStack.pop();
      if (callStackElem === undefined) {
        throw new Error("The call stack shouldn't be empty");
      }

      const node = this.getOneNode(callStackElem.nodeId);
      if (!callStackElem.allDependentsVisited) {
        // Make sure the node n will be visited again after all dependents are
        // visited
        callStack.push({
          nodeId: callStackElem.nodeId,
          allDependentsVisited: true,
        });

        const dependentNodeIds = this.getTopologicalSortDirectionNodeIds(
          node,
          direction,
        );
        dependentNodeIds.forEach((dependentNodeId) => {
          // Check if the dependent node has been visited (3)
          if (visitedNodeIds.has(dependentNodeId)) {
            return;
          }

          // Call visit() on the dependent node (4)
          callStack.push({
            nodeId: dependentNodeId,
            allDependentsVisited: false,
          });
        });
      } else {
        // Mark the node as visited (5)
        visitedNodeIds.add(callStackElem.nodeId);
        // Add node to the results (6)
        reverseResult.push(callStackElem.nodeId);
      }
    }

    return reverseResult;
  }

  // TODO(sc420): should use BFS
  updateFValuesFrom(startNodeId: string): Set<string> {
    const nodeIdsToBeUpdated = new Set<string>([startNodeId]);
    const updatedNodeIds = new Set<string>();
    while (nodeIdsToBeUpdated.size > 0) {
      const nodeId = Graph.popFromSet(nodeIdsToBeUpdated);
      if (nodeId === undefined) {
        throw new Error("Should have at least one node in the queue");
      }

      // Update f()
      const node = this.getOneNode(nodeId);
      node.updateF();
      updatedNodeIds.add(nodeId);

      const neighborNodeIds = this.getFDirectionNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  // TODO(sc420): should use BFS
  updateDerivatives(): Set<string> {
    if (this.targetNodeId === null) {
      return new Set<string>();
    }

    const nodeIdsToBeUpdated = new Set<string>([this.targetNodeId]);
    const updatedNodeIds = new Set<string>();
    while (nodeIdsToBeUpdated.size > 0) {
      const nodeId = Graph.popFromSet(nodeIdsToBeUpdated);
      if (nodeId === undefined) {
        throw new Error("Should have at least one node in the queue");
      }

      const node = this.getOneNode(nodeId);
      let totalDerivative = 0;
      if (nodeId === this.targetNodeId) {
        totalDerivative = node.calculateDfdy(node);
      } else {
        if (this.differentiationMode === "FORWARD") {
          // Update d(node)/d(targetNode) for forward mode
          node
            .getRelationship()
            .getInputNodes()
            .forEach((inputNode) => {
              // d(inputNode)/d(targetNode)
              const derivative1 = this.getNodeDerivative(inputNode.getId());
              // d(node)/d(inputNode)
              const derivative2 = node.calculateDfdy(inputNode);
              // d(node)/d(targetNode) = d(inputNode)/d(targetNode) *
              // d(node)/d(inputNode) (chain rule)
              totalDerivative += derivative1 * derivative2;
            });
        } else {
          // Update d(targetNode)/d(node) for reverse mode
          node
            .getRelationship()
            .getOutputNodes()
            .forEach((outputNode) => {
              // d(outputNode)/d(node)
              const derivative1 = outputNode.calculateDfdy(node);
              // d(targetNode)/d(outputNode)
              const derivative2 = this.getNodeDerivative(outputNode.getId());
              // d(targetNode)/d(node) = d(outputNode)/d(node) *
              // d(targetNode)/d(outputNode)
              totalDerivative += derivative1 * derivative2;
            });
        }
      }
      this.nodeIdToDerivatives.set(nodeId, totalDerivative);
      updatedNodeIds.add(nodeId);

      const neighborNodeIds =
        this.getDerivativeDirectionNeighborNodeIds(nodeId);
      neighborNodeIds.forEach((neighborNodeId) => {
        if (updatedNodeIds.has(neighborNodeId)) {
          return;
        }
        nodeIdsToBeUpdated.add(neighborNodeId);
      });
    }

    return updatedNodeIds;
  }

  /**
   * Gets terminal node (nodes that don't have any output nodes) IDs.
   *
   * @returns List of terminal node IDs.
   */
  private getTerminalNodeIds(): string[] {
    const terminalNodeIds: string[] = [];
    this.getNodes().forEach((node) => {
      if (node.getRelationship().isOutputPortEmpty()) {
        terminalNodeIds.push(node.getId());
      }
    });
    return terminalNodeIds;
  }

  private getFDirectionNeighborNodeIds(nodeId: string): Set<string> {
    const node = this.getOneNode(nodeId);
    const neighborNodes = node.getRelationship().getOutputNodes();
    const neighborNodeIds = neighborNodes.map((node) => node.getId());
    return new Set<string>(neighborNodeIds);
  }

  private getTopologicalSortDirectionNodeIds(
    node: GraphNode,
    direction: TopologicalSortDirection,
  ): string[] {
    let neighborNodes: GraphNode[] = [];
    if (direction === "TO_INPUT") {
      neighborNodes = node.getRelationship().getInputNodes();
    } else {
      neighborNodes = node.getRelationship().getOutputNodes();
    }
    return neighborNodes.map((node) => node.getId());
  }

  private getDerivativeDirectionNeighborNodeIds(nodeId: string): Set<string> {
    const node = this.getOneNode(nodeId);
    let neighborNodes: GraphNode[] = [];
    if (this.differentiationMode === "FORWARD") {
      neighborNodes = node.getRelationship().getOutputNodes();
    } else {
      neighborNodes = node.getRelationship().getInputNodes();
    }
    const neighborNodeIds = neighborNodes.map((node) => node.getId());
    return new Set<string>(neighborNodeIds);
  }

  private static popFromSet(inputSet: Set<string>): string {
    const iterator = inputSet.values();
    const { value } = iterator.next();
    if (value === undefined) {
      throw new Error("The input set should be non-empty");
    }
    inputSet.delete(value);
    return value;
  }
}

export default Graph;
