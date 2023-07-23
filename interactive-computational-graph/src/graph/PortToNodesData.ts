type PortToNodesData = Record<string, NodeIdToNodeData>;

type NodeIdToNodeData = Record<string, NodeData>;

interface NodeData {
  id: string;
  value: number;
}

export type { PortToNodesData, NodeIdToNodeData, NodeData };
