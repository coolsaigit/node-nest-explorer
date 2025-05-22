
import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ExpandIcon } from 'lucide-react';

import CustomNode from './CustomNode';
import { parseMermaidFlowchart, NodeData } from '../utils/mermaidParser';

// Dynamic spacing configuration
const HORIZONTAL_NODE_SPACING = 150; // Space between nodes horizontally
const VERTICAL_NODE_SPACING = 150;   // Space between hierarchy levels
const MIN_NODE_WIDTH = 120;          // Minimum width of a node

// Node hierarchy mapping function
const buildNodeHierarchy = (nodes: Node<NodeData>[]) => {
  const nodeMap = new Map<string, Node<NodeData>>();
  const childToParent = new Map<string, string>();
  
  // Build maps for quick lookup
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
    if (node.data.children) {
      node.data.children.forEach(childId => {
        childToParent.set(childId, node.id);
      });
    }
  });
  
  return { nodeMap, childToParent };
};

// Get node depth in hierarchy
const getNodeDepth = (nodeId: string, childToParent: Map<string, string>): number => {
  let depth = 0;
  let currentId = nodeId;
  
  while (childToParent.has(currentId)) {
    depth++;
    currentId = childToParent.get(currentId)!;
  }
  
  return depth;
};

// Get all children of a node including nested children
const getAllChildren = (nodeId: string, nodeMap: Map<string, Node<NodeData>>): string[] => {
  const node = nodeMap.get(nodeId);
  if (!node || !node.data.children) return [];
  
  const allChildren = [...node.data.children];
  node.data.children.forEach(childId => {
    allChildren.push(...getAllChildren(childId, nodeMap));
  });
  
  return allChildren;
};

// Calculate width required by a node and its children
const calculateNodeWidth = (nodeId: string, nodeMap: Map<string, Node<NodeData>>, childToParent: Map<string, string>): number => {
  const node = nodeMap.get(nodeId);
  if (!node || !node.data.children || node.data.children.length === 0) {
    return MIN_NODE_WIDTH;
  }
  
  // If collapsed, return just this node's width
  if (node.data.isCollapsed) {
    return MIN_NODE_WIDTH;
  }
  
  // Get direct children at the same level
  const directChildren = node.data.children;
  const childrenAtSameDepth: {[depth: number]: string[]} = {};
  
  directChildren.forEach(childId => {
    const childDepth = getNodeDepth(childId, childToParent);
    if (!childrenAtSameDepth[childDepth]) {
      childrenAtSameDepth[childDepth] = [];
    }
    childrenAtSameDepth[childDepth].push(childId);
  });
  
  // Find the depth with the most nodes
  let maxWidth = 0;
  Object.values(childrenAtSameDepth).forEach(children => {
    let levelWidth = 0;
    children.forEach(childId => {
      levelWidth += calculateNodeWidth(childId, nodeMap, childToParent) + HORIZONTAL_NODE_SPACING;
    });
    // Remove the last spacing
    if (children.length > 0) {
      levelWidth -= HORIZONTAL_NODE_SPACING;
    }
    maxWidth = Math.max(maxWidth, levelWidth);
  });
  
  return Math.max(maxWidth, MIN_NODE_WIDTH);
};

// Position nodes based on hierarchy
const positionNodes = (nodes: Node<NodeData>[]): Node<NodeData>[] => {
  const { nodeMap, childToParent } = buildNodeHierarchy(nodes);
  
  // Group nodes by depth
  const nodesByDepth: {[key: number]: Node<NodeData>[]} = {};
  nodes.forEach(node => {
    const depth = getNodeDepth(node.id, childToParent);
    if (!nodesByDepth[depth]) {
      nodesByDepth[depth] = [];
    }
    nodesByDepth[depth].push(node);
  });
  
  // Position nodes by depth, starting with root (depth 0)
  const rootNode = nodesByDepth[0][0];
  rootNode.position = { x: 400, y: 50 };
  
  // For each depth level
  Object.keys(nodesByDepth).map(Number).sort().forEach(depth => {
    if (depth === 0) return; // Skip root node
    
    const nodesAtDepth = nodesByDepth[depth];
    
    // Group children by parent
    const childrenByParent: {[parentId: string]: Node<NodeData>[]} = {};
    nodesAtDepth.forEach(node => {
      const parentId = childToParent.get(node.id);
      if (!parentId) return;
      
      if (!childrenByParent[parentId]) {
        childrenByParent[parentId] = [];
      }
      childrenByParent[parentId].push(node);
    });
    
    // Position children under their parents
    Object.entries(childrenByParent).forEach(([parentId, children]) => {
      const parentNode = nodeMap.get(parentId)!;
      
      // Skip if parent is collapsed
      if (parentNode.data.isCollapsed) return;
      
      // Calculate total width needed for all children
      let totalChildrenWidth = 0;
      children.forEach(child => {
        totalChildrenWidth += calculateNodeWidth(child.id, nodeMap, childToParent);
      });
      
      // Add spacing between children
      totalChildrenWidth += (children.length - 1) * HORIZONTAL_NODE_SPACING;
      
      // Starting x position (centered under parent)
      let startX = parentNode.position.x - totalChildrenWidth / 2;
      
      // Position each child
      children.forEach(child => {
        const childWidth = calculateNodeWidth(child.id, nodeMap, childToParent);
        
        // Center the child relative to its own width
        const centeredX = startX + childWidth / 2;
        
        child.position = {
          x: centeredX,
          y: parentNode.position.y + VERTICAL_NODE_SPACING
        };
        
        startX += childWidth + HORIZONTAL_NODE_SPACING;
      });
    });
  });
  
  return nodes.map(node => ({
    ...node,
    hidden: isNodeHidden(node.id, nodes)
  }));
};

// Create edges based on parent-child relationships
const createEdges = (nodes: Node<NodeData>[], selectedNodeId: string | null = null): Edge[] => {
  const edges: Edge[] = [];
  const { childToParent } = buildNodeHierarchy(nodes);
  
  nodes.forEach((node) => {
    if (node.data.children && !node.data.isCollapsed) {
      node.data.children.forEach((childId) => {
        // Check if this edge is part of the path from main to the selected node
        let isHighlighted = false;
        
        if (selectedNodeId) {
          let currentId = selectedNodeId;
          
          // Trace back from selected node to root to find the path
          while (childToParent.has(currentId)) {
            const parentId = childToParent.get(currentId)!;
            if (parentId === node.id && childId === currentId) {
              isHighlighted = true;
              break;
            }
            currentId = parentId;
          }
        }
        
        edges.push({
          id: `${node.id}-${childId}`,
          source: node.id,
          target: childId,
          type: 'smoothstep',
          animated: isHighlighted,
          style: isHighlighted ? { 
            strokeWidth: 3, 
            stroke: '#FF6B6B', 
            strokeDasharray: '5,5' 
          } : undefined,
        });
      });
    }
  });
  
  return edges;
};

// Get all descendant nodes recursively
const getDescendantIds = (nodeId: string, nodes: Node<NodeData>[]): string[] => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node || !node.data.children) return [];
  
  let descendants: string[] = [...node.data.children];
  
  node.data.children.forEach((childId) => {
    descendants = [...descendants, ...getDescendantIds(childId, nodes)];
  });
  
  return descendants;
};

// Check if a node should be hidden based on ancestor collapse states
const isNodeHidden = (nodeId: string, nodes: Node<NodeData>[]): boolean => {
  // Find all parent nodes
  const parentNode = nodes.find((n) => 
    n.data.children && n.data.children.includes(nodeId)
  );
  
  if (!parentNode) return false;
  
  // If parent is collapsed, this node should be hidden
  if (parentNode.data.isCollapsed) return true;
  
  // Check if any ancestor is collapsed
  return isNodeHidden(parentNode.id, nodes);
};

// Function to find the path from root to a node
const getPathToNode = (nodeId: string, childToParent: Map<string, string>): string[] => {
  const path: string[] = [nodeId];
  let currentId = nodeId;
  
  while (childToParent.has(currentId)) {
    currentId = childToParent.get(currentId)!;
    path.unshift(currentId);
  }
  
  return path;
};

// Default Mermaid code
const defaultMermaidCode = `graph TD
  A[main] --> B[1000]
  A --> C[2000]
  A --> D[3000]
  A --> E[4000]

  B --> F[1100]

  C --> G[2100]
  C --> H[2200]

  G --> I[2110]
  G --> J[2120]

  D --> K[3100]
  D --> L[3200]
  D --> M[3300]

  K --> N[3110]

  E --> O[4100]
  E --> P[4200]`;

const FlowDiagram: React.FC = () => {
  // Parse the default Mermaid code to get initial nodes
  const { nodes: initialNodes } = parseMermaidFlowchart(defaultMermaidCode);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>(defaultMermaidCode);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  
  // Apply dynamic positioning when the component mounts or when nodes change
  useEffect(() => {
    setNodes(positionNodes([...nodes]));
    setEdges(createEdges([...nodes], selectedNode));
  }, []);
  
  const onToggleCollapse = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          // Toggle collapsed state
          const isCollapsed = !node.data.isCollapsed;
          return {
            ...node,
            data: {
              ...node.data,
              isCollapsed,
            },
          };
        }
        return node;
      });
      
      // Reposition nodes and update edges after collapsing/expanding
      const positionedNodes = positionNodes(updatedNodes);
      setEdges(createEdges(positionedNodes, selectedNode));
      
      return positionedNodes;
    });
  }, [selectedNode, setNodes, setEdges]);

  // Handle expand all nodes functionality
  const handleExpandAll = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        // If the node is collapsible, set it to expanded
        if (node.data && node.data.isCollapsible) {
          return {
            ...node,
            data: {
              ...node.data,
              isCollapsed: false,
            },
          };
        }
        return node;
      });
      
      // Reposition nodes and update edges after expanding all
      const positionedNodes = positionNodes(updatedNodes);
      setEdges(createEdges(positionedNodes, selectedNode));
      
      return positionedNodes;
    });
  }, [selectedNode, setNodes, setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation(); // Prevent the click from propagating to the pane
    setSelectedNode(node.id);
    
    // Update edges to highlight the path
    setEdges(createEdges(nodes, node.id));
  }, [nodes, setEdges]);

  // Add a handler for clicking on the pane (outside nodes)
  const onPaneClick = useCallback(() => {
    if (selectedNode) {
      setSelectedNode(null);
      // Update edges to remove highlighting
      setEdges(createEdges(nodes, null));
    }
  }, [selectedNode, nodes, setEdges]);
  
  // Handle Mermaid code update
  const handleMermaidUpdate = () => {
    try {
      const { nodes: newNodes } = parseMermaidFlowchart(mermaidCode);
      setNodes(positionNodes(newNodes));
      setEdges(createEdges(newNodes, null));
      setSelectedNode(null);
      setShowEditor(false);
    } catch (error) {
      console.error("Error parsing Mermaid code:", error);
      alert("Error parsing Mermaid code. Please check the syntax.");
    }
  };

  // Prepare nodes with toggle collapse function
  const nodeTypes = {
    custom: CustomNode,
  };
  
  const visibleNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onToggleCollapse: () => onToggleCollapse(node.id),
    },
    style: {
      ...node.style,
      // Highlight the selected node with a different border color
      ...(selectedNode === node.id && { borderColor: '#FF6B6B', borderWidth: '3px' })
    }
  }));

  return (
    <div className="flow-container h-screen relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {showEditor ? (
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Mermaid Flowchart Code</h3>
            <textarea 
              className="w-full h-64 border border-gray-300 p-2 rounded mb-2 font-mono text-sm"
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-1 bg-gray-200 rounded"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-1 bg-blue-500 text-white rounded"
                onClick={handleMermaidUpdate}
              >
                Apply
              </button>
            </div>
          </div>
        ) : (
          <>
            <Button 
              onClick={() => setShowEditor(true)}
              className="bg-white text-gray-800 hover:bg-gray-100"
              variant="outline"
            >
              Edit Mermaid
            </Button>
            <Button 
              onClick={handleExpandAll}
              className="bg-white text-gray-800 hover:bg-gray-100"
              variant="outline"
            >
              <ExpandIcon className="mr-1" size={16} />
              Expand All
            </Button>
          </>
        )}
      </div>
      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowDiagram;
