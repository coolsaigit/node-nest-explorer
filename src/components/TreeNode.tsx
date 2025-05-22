
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="tree-node">
      <div 
        className={cn(
          "flex items-center gap-2 mb-2 cursor-pointer", 
          "transition-all duration-200"
        )}
        onClick={toggleExpand}
      >
        <div 
          className={cn(
            "py-2 px-4 bg-blue-500 text-white rounded-md whitespace-nowrap",
            "shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-2"
          )}
        >
          {node.label}
          {hasChildren && (
            <span className="flex items-center justify-center w-5 h-5 bg-blue-400 rounded-full text-white">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div 
          className={cn(
            "pl-8 ml-6 border-l-2 border-blue-200",
            "transition-all duration-300"
          )}
        >
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
