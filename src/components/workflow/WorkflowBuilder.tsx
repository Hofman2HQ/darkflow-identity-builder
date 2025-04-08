import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ServiceNode, { ServiceType } from './ServiceNode';
import ControlPanel from './ControlPanel';
import NodeConfigPanel from './NodeConfigPanel';
import ConnectionConfigPanel from './ConnectionConfigPanel';
import { toast } from '@/hooks/use-toast';

const nodeTypes = {
  serviceNode: ServiceNode,
};

const initialNodes: Node[] = [
  {
    id: 'webapp-1',
    type: 'serviceNode',
    position: { x: 250, y: 50 },
    data: { 
      type: 'WebApp', 
      label: 'WebApp Entry', 
      isEntry: true,
      config: { appId: 'default-app', flowName: 'ID Verification Flow' }
    },
  },
];

const initialEdges: Edge[] = [];

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Validation
  const validateWorkflow = useCallback(() => {
    // Check if there's exactly one WebApp node
    const webAppNodes = nodes.filter(n => n.data.type === 'WebApp');
    const hasOneWebApp = webAppNodes.length === 1;
    
    // Validate nodes and mark them as valid/invalid
    const updatedNodes = nodes.map(node => {
      let isValid = true;
      
      if (node.data.type === 'WebApp' && !hasOneWebApp) {
        isValid = false;
      }
      
      // Check if non-WebApp nodes have incoming connections
      if (node.data.type !== 'WebApp' && node.data.type !== 'TextNode') {
        const hasIncoming = edges.some(e => e.target === node.id);
        if (!hasIncoming) {
          isValid = false;
        }
      }
      
      return {
        ...node,
        data: {
          ...node.data,
          isValid
        }
      };
    });
    
    // Update nodes with validation status
    setNodes(updatedNodes);
    
    // Count errors for toast notification
    const invalidNodesCount = updatedNodes.filter(n => !n.data.isValid).length;
    if (invalidNodesCount > 0) {
      toast({
        title: "Workflow Validation",
        description: `Found ${invalidNodesCount} issues in your workflow. Hover over nodes for details.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [nodes, edges, setNodes, toast]);
  
  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);
  
  // Handle edge selection
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);
  
  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);
  
  // Connection handler
  const onConnect = useCallback((params: Connection) => {
    // Create a unique ID for the edge
    const edgeId = `e${params.source}-${params.target}`;
    const newEdge = {
      ...params,
      id: edgeId,
      animated: true,
      data: { conditionType: 'match', label: 'On Match' }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  // Node updater
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  // Edge updater
  const updateEdgeData = useCallback((edgeId: string, newData: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...newData,
            },
            label: newData.label || edge.label
          };
        }
        return edge;
      })
    );
  }, [setEdges]);
  
  // Add a new node
  const addNode = useCallback((type: ServiceType) => {
    // Check if adding a WebApp and one already exists
    if (type === 'WebApp' && nodes.some(n => n.data.type === 'WebApp')) {
      toast({
        title: "Cannot add WebApp",
        description: "Only one WebApp node is allowed in the workflow.",
        variant: "destructive"
      });
      return;
    }
    
    if (!reactFlowInstance) return;
    
    const position = reactFlowInstance.screenToFlowPosition({
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
    });

    const newNode: Node = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type: 'serviceNode',
      position,
      data: { type, label: type, config: {} },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes, reactFlowInstance, setNodes, toast]);
  
  // Clear the workflow
  const clearWorkflow = useCallback(() => {
    // Keep only the WebApp node
    const webAppNode = nodes.find(n => n.data.type === 'WebApp');
    if (webAppNode) {
      setNodes([webAppNode]);
    } else {
      setNodes([]);
    }
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    
    toast({
      title: "Workflow Cleared",
      description: "All nodes except WebApp have been removed.",
    });
  }, [nodes, setNodes, setEdges, toast]);
  
  // Save workflow
  const saveWorkflow = useCallback(() => {
    const isValid = validateWorkflow();
    
    if (!isValid) {
      toast({
        title: "Cannot Save Workflow",
        description: "Please fix validation errors first.",
        variant: "destructive"
      });
      return;
    }
    
    const workflow = {
      nodes,
      edges,
    };
    
    // In a real app, we would send this to a server
    // For now, we'll just simulate saving
    console.log('Saving workflow:', workflow);
    localStorage.setItem('workflow', JSON.stringify(workflow));
    
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully.",
    });
  }, [nodes, edges, validateWorkflow, toast]);
  
  // Import workflow
  const importWorkflow = useCallback(() => {
    try {
      const savedWorkflow = localStorage.getItem('workflow');
      if (savedWorkflow) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedWorkflow);
        setNodes(savedNodes);
        setEdges(savedEdges);
        toast({
          title: "Workflow Imported",
          description: "Workflow has been loaded successfully.",
        });
      } else {
        toast({
          title: "No Saved Workflow",
          description: "There is no saved workflow to import.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import workflow.",
        variant: "destructive"
      });
    }
  }, [setNodes, setEdges, toast]);
  
  // Export workflow
  const exportWorkflow = useCallback(() => {
    const isValid = validateWorkflow();
    
    if (!isValid) {
      toast({
        title: "Cannot Export Workflow",
        description: "Please fix validation errors first.",
        variant: "destructive"
      });
      return;
    }
    
    const workflow = {
      nodes,
      edges,
    };
    
    const jsonString = JSON.stringify(workflow, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    
    // Create a download link and trigger it
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', 'workflow.json');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Workflow Exported",
      description: "Your workflow has been exported as JSON.",
    });
  }, [nodes, edges, validateWorkflow, toast]);
  
  // Load an example workflow on first render
  useEffect(() => {
    // You can add more example nodes and edges here if needed
  }, []);
  
  return (
    <div className="h-screen" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        onInit={setReactFlowInstance}
      >
        <Controls />
        <MiniMap nodeBorderRadius={2} />
        <Background gap={12} size={1} />
        
        <Panel position="bottom-center">
          <Button 
            variant="default" 
            onClick={validateWorkflow}
            className="bg-primary hover:bg-primary/90"
          >
            Validate Workflow
          </Button>
        </Panel>
      </ReactFlow>
      
      <ControlPanel
        onAddNode={addNode}
        onClear={clearWorkflow}
        onSave={saveWorkflow}
        onImport={importWorkflow}
        onExport={exportWorkflow}
      />
      
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNodeData}
        />
      )}
      
      {selectedEdge && (
        <ConnectionConfigPanel
          edge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onUpdate={updateEdgeData}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;
