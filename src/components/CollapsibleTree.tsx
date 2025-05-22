
import React from "react";
import TreeNode, { TreeNodeData } from "./TreeNode";

interface CollapsibleTreeProps {
  data: TreeNodeData;
  className?: string;
}

const CollapsibleTree: React.FC<CollapsibleTreeProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <TreeNode node={data} />
    </div>
  );
};

export default CollapsibleTree;
