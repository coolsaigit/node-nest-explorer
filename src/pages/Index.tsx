
import React from "react";
import CollapsibleTree from "../components/CollapsibleTree";
import { treeData } from "../data/treeData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <header className="w-full p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center">Hierarchical Flowchart</h1>
      </header>
      
      <main className="flex-1 w-full max-w-7xl p-6 overflow-auto">
        <div className="p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-8 text-center">
            Click on a node to collapse/expand its children
          </p>
          
          <div className="overflow-auto py-8">
            <CollapsibleTree data={treeData} className="min-w-fit" />
          </div>
        </div>
      </main>
      
      <footer className="w-full p-4 text-center text-gray-500 text-sm">
        <p>Interactive hierarchical flowchart with collapsible nodes</p>
      </footer>
    </div>
  );
};

export default Index;
