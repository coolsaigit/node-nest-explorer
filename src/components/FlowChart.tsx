
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import initial data
import { initialNodes, initialEdges } from '../data/flowchartData';

interface FlowChartProps {
  className?: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ className }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to handle node expansion/collapse
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Ignore if the node has no children
      const childrenNodes = nodes.filter(
        (n) => n.data.parentNode === node.id && n.id !== node.id
      );
      
      if (childrenNodes.length === 0) return;
      
      setNodes((nds) =>
        nds.map((n) => {
          // For the clicked node, toggle its expanded state
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                expanded: !n.data.expanded,
              },
            };
          }
          
          // For all child nodes (direct and indirect), toggle visibility based on parent's expanded state
          if (isDescendant(n.data.parentNode, node.id, nds)) {
            // If the parent is being collapsed, hide the child
            // If the parent is being expanded and its parent is visible, show the child
            const parentNode = nds.find((node) => node.id === node.id);
            const parentExpanded = parentNode?.data.expanded !== false;
            const parentVisible = parentNode?.hidden !== true;
            
            // Show only direct children when expanding
            const shouldShow = n.data.parentNode === node.id && !nodes.find(node => node.id === n.id)?.data.expanded;
            
            return {
              ...n,
              hidden: !shouldShow,
            };
          }
          
          return n;
        })
      );
      
      // Also update edges visibility based on node visibility
      setEdges((eds) =>
        eds.map((e) => {
          const sourceNode = nodes.find((n) => n.id === e.source);
          const targetNode = nodes.find((n) => n.id === e.target);
          
          const isSourceHidden = sourceNode?.hidden || false;
          const isTargetHidden = targetNode?.hidden || false;
          
          return {
            ...e,
            hidden: isSourceHidden || isTargetHidden,
          };
        })
      );
    },
    [nodes, setNodes, setEdges]
  );
  
  // Helper function to check if a node is a descendant of another node
  const isDescendant = (childParentId: string | undefined, parentId: string, nodesList: Node[]) => {
    if (!childParentId) return false;
    if (childParentId === parentId) return true;
    
    const parentNode = nodesList.find((n) => n.id === childParentId);
    return parentNode ? isDescendant(parentNode.data.parentNode, parentId, nodesList) : false;
  };

  return (
    <div className={`w-full h-[500px] ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;
