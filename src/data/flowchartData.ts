
import { Node, Edge, Position, MarkerType } from '@xyflow/react';

export const initialNodes: Node[] = [
  // Main node
  {
    id: 'main',
    type: 'default',
    data: { 
      label: 'main', 
      expanded: true 
    },
    position: { x: 400, y: 0 },
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 180,
      padding: '10px',
      textAlign: 'center',
    }
  },
  
  // Level 1 nodes
  {
    id: '1000',
    type: 'default',
    data: { 
      label: '1000', 
      expanded: false,
      parentNode: 'main'
    },
    position: { x: 100, y: 100 },
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '2000',
    type: 'default',
    data: { 
      label: '2000', 
      expanded: false,
      parentNode: 'main'
    },
    position: { x: 300, y: 100 },
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '3000',
    type: 'default',
    data: { 
      label: '3000', 
      expanded: false,
      parentNode: 'main'
    },
    position: { x: 500, y: 100 },
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '4000',
    type: 'default',
    data: { 
      label: '4000', 
      expanded: false,
      parentNode: 'main'
    },
    position: { x: 700, y: 100 },
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  
  // Level 2 nodes - initially hidden
  {
    id: '1100',
    type: 'default',
    data: { 
      label: '1100', 
      parentNode: '1000'
    },
    position: { x: 100, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '2100',
    type: 'default',
    data: { 
      label: '2100', 
      expanded: false,
      parentNode: '2000'
    },
    position: { x: 200, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '2200',
    type: 'default',
    data: { 
      label: '2200', 
      parentNode: '2000'
    },
    position: { x: 400, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '3100',
    type: 'default',
    data: { 
      label: '3100', 
      expanded: false,
      parentNode: '3000'
    },
    position: { x: 400, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '3200',
    type: 'default',
    data: { 
      label: '3200', 
      parentNode: '3000'
    },
    position: { x: 500, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '3300',
    type: 'default',
    data: { 
      label: '3300', 
      parentNode: '3000'
    },
    position: { x: 600, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '4100',
    type: 'default',
    data: { 
      label: '4100', 
      parentNode: '4000'
    },
    position: { x: 650, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '4200',
    type: 'default',
    data: { 
      label: '4200', 
      parentNode: '4000'
    },
    position: { x: 750, y: 200 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  
  // Level 3 nodes - initially hidden
  {
    id: '2110',
    type: 'default',
    data: { 
      label: '2110', 
      parentNode: '2100'
    },
    position: { x: 150, y: 300 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '2120',
    type: 'default',
    data: { 
      label: '2120', 
      parentNode: '2100'
    },
    position: { x: 250, y: 300 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  },
  {
    id: '3110',
    type: 'default',
    data: { 
      label: '3110', 
      parentNode: '3100'
    },
    position: { x: 400, y: 300 },
    hidden: true,
    style: {
      background: '#60a5fa',
      color: 'white',
      borderRadius: '8px',
      width: 120,
      padding: '10px',
      textAlign: 'center',
    }
  }
];

export const initialEdges: Edge[] = [
  // Main to level 1
  { 
    id: 'main-1000', 
    source: 'main', 
    target: '1000',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' }
  },
  { 
    id: 'main-2000', 
    source: 'main', 
    target: '2000',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' }
  },
  { 
    id: 'main-3000', 
    source: 'main', 
    target: '3000',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' }
  },
  { 
    id: 'main-4000', 
    source: 'main', 
    target: '4000',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' }
  },
  
  // Level 1 to level 2
  { 
    id: '1000-1100', 
    source: '1000', 
    target: '1100',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '2000-2100', 
    source: '2000', 
    target: '2100',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '2000-2200', 
    source: '2000', 
    target: '2200',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '3000-3100', 
    source: '3000', 
    target: '3100',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '3000-3200', 
    source: '3000', 
    target: '3200',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '3000-3300', 
    source: '3000', 
    target: '3300',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '4000-4100', 
    source: '4000', 
    target: '4100',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '4000-4200', 
    source: '4000', 
    target: '4200',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  
  // Level 2 to level 3
  { 
    id: '2100-2110', 
    source: '2100', 
    target: '2110',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '2100-2120', 
    source: '2100', 
    target: '2120',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  },
  { 
    id: '3100-3110', 
    source: '3100', 
    target: '3110',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#60a5fa' },
    hidden: true
  }
];
