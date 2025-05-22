
import { Node, Edge } from '@xyflow/react';

export type NodeData = {
  label: string;
  children?: string[];
  isCollapsible?: boolean;
  isCollapsed?: boolean;
};

// Parse a Mermaid flowchart string and return nodes and edges
export function parseMermaidFlowchart(mermaidCode: string): {
  nodes: Node<NodeData>[];
  edges: Edge[];
} {
  // Remove "graph TD" or similar directive and trim whitespace
  const cleanCode = mermaidCode.replace(/^\s*graph\s+(TD|LR|RL|BT)\s*/i, '').trim();
  
  // Split the input into lines
  const lines = cleanCode.split('\n').map(line => line.trim()).filter(line => line);
  
  // Map to store node information (id -> children)
  const nodeChildren: Record<string, string[]> = {};
  
  // Map to store node labels
  const nodeLabels: Record<string, string> = {};
  
  // Process each line to extract connections
  lines.forEach(line => {
    // Match "[nodeId][label]" pattern or just "nodeId"
    const nodeMatches = line.matchAll(/([A-Za-z0-9_-]+)(?:\[([^\]]+)\])?/g);
    const nodes = Array.from(nodeMatches).map(match => ({
      id: match[1],
      label: match[2] || match[1] // Use the node ID as label if no label is provided
    }));
    
    // Store labels
    nodes.forEach(node => {
      nodeLabels[node.id] = node.label;
    });
    
    // Match "A --> B" or "A --> B & C" pattern
    if (line.includes('-->')) {
      const parts = line.split('-->');
      if (parts.length >= 2) {
        // Extract source node
        const sourceId = extractNodeId(parts[0]);
        
        // Extract target node(s)
        const targetPart = parts[1].trim();
        const targetIds = targetPart.includes('&')
          ? targetPart.split('&').map(t => extractNodeId(t))
          : [extractNodeId(targetPart)];
        
        // Store the relationships
        if (!nodeChildren[sourceId]) {
          nodeChildren[sourceId] = [];
        }
        
        // Add children
        targetIds.forEach(targetId => {
          if (targetId && !nodeChildren[sourceId].includes(targetId)) {
            nodeChildren[sourceId].push(targetId);
          }
        });
      }
    }
  });
  
  // Get unique node IDs
  const nodeIds = new Set([
    ...Object.keys(nodeChildren),
    ...Object.values(nodeChildren).flat()
  ]);
  
  // Create nodes
  const nodes: Node<NodeData>[] = Array.from(nodeIds).map(id => {
    const hasChildren = nodeChildren[id] && nodeChildren[id].length > 0;
    
    return {
      id,
      type: 'custom',
      position: { x: 0, y: 0 }, // Initial position, will be updated by algorithm
      data: {
        label: nodeLabels[id] || id,
        children: hasChildren ? nodeChildren[id] : undefined,
        isCollapsible: hasChildren,
        isCollapsed: hasChildren, // Start with collapsed nodes
      },
    };
  });
  
  // Create edges based on parent-child relationships
  const edges: Edge[] = [];
  Object.entries(nodeChildren).forEach(([parentId, childIds]) => {
    childIds.forEach(childId => {
      edges.push({
        id: `${parentId}-${childId}`,
        source: parentId,
        target: childId,
        type: 'smoothstep',
      });
    });
  });
  
  return { nodes, edges };
}

// Helper function to extract node ID from a string like "A[Main]" -> "A"
function extractNodeId(text: string): string {
  const match = text.trim().match(/^([A-Za-z0-9_-]+)/);
  return match ? match[1] : '';
}
