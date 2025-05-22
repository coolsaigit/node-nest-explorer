
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
  data: {
    label: string;
    isCollapsible: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
  };
  id: string;
  selected?: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, selected }) => {
  return (
    <div 
      className={`react-flow__node-custom p-3 rounded-md border-2 text-white ${selected ? 'border-[#FF6B6B]' : 'border-nodeBorder bg-nodeBlue'}`}
      style={{ 
        minWidth: '100px', 
        textAlign: 'center',
        position: 'relative',
        borderWidth: selected ? '3px' : '2px',
        transition: 'all 0.3s ease'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={false} 
        style={{ top: -8 }} 
      />
      <div className="font-medium">{data.label}</div>
      {data.isCollapsible && (
        <div 
          className="collapse-button absolute -right-2 -bottom-2 bg-white text-nodeBlue w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border border-nodeBorder font-bold"
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleCollapse();
          }}
        >
          {data.isCollapsed ? '+' : '-'}
        </div>
      )}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={false} 
        style={{ bottom: -8 }} 
      />
    </div>
  );
};

export default CustomNode;
