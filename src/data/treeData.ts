
import { NodeData } from "../utils/mermaidParser";

export interface TreeNodeData {
  id: string;
  label: string;
  children: TreeNodeData[];
}

export const treeData: TreeNodeData = {
  id: "main",
  label: "main",
  children: [
    {
      id: "1000",
      label: "1000",
      children: [
        {
          id: "1100",
          label: "1100",
          children: []
        }
      ]
    },
    {
      id: "2000",
      label: "2000",
      children: [
        {
          id: "2100",
          label: "2100",
          children: [
            {
              id: "2110",
              label: "2110",
              children: []
            },
            {
              id: "2120",
              label: "2120",
              children: []
            }
          ]
        },
        {
          id: "2200",
          label: "2200",
          children: []
        }
      ]
    },
    {
      id: "3000",
      label: "3000",
      children: [
        {
          id: "3100",
          label: "3100",
          children: [
            {
              id: "3110",
              label: "3110",
              children: []
            }
          ]
        },
        {
          id: "3200",
          label: "3200",
          children: []
        },
        {
          id: "3300",
          label: "3300",
          children: []
        }
      ]
    },
    {
      id: "4000",
      label: "4000",
      children: [
        {
          id: "4100",
          label: "4100",
          children: []
        },
        {
          id: "4200",
          label: "4200",
          children: []
        }
      ]
    }
  ]
};
