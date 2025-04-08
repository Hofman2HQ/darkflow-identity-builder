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
import { Button } from '@/components/ui/button';

import ServiceNode, { ServiceType, LogicType } from './ServiceNode';
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
  
  const validateWorkflow = useCallback(() => {
    const webAppNodes = nodes.filter(n => n.data.type === 'WebApp');
    const hasOneWebApp = webAppNodes.length === 1;
    
    const updatedNodes = nodes.map(node => {
      let isValid = true;
      
      if (node.data.type === 'WebApp' && !hasOneWebApp) {
        isValid = false;
      }
      
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
    
    setNodes(updatedNodes);
    
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
  }, [nodes, edges, setNodes]);
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);
  
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);
  
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);
  
  const onConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    let defaultLabel = 'Connection';
    let defaultConditionType = 'match';
    
    if (sourceNode && sourceNode.data.type === 'ConditionalLogic') {
      const logicType = sourceNode.data.logicType as LogicType;
      if (logicType === 'Success') {
        defaultLabel = 'On Success';
        defaultConditionType = 'success';
      } else if (logicType === 'Failed') {
        defaultLabel = 'On Failure';
        defaultConditionType = 'failure';
      } else if (logicType === 'Conditional') {
        defaultLabel = 'If Condition Met';
        defaultConditionType = 'condition';
      } else if (logicType === 'Indecisive') {
        defaultLabel = 'On Review';
        defaultConditionType = 'review';
      } else if (logicType === 'Custom') {
        defaultLabel = 'Custom Path';
        defaultConditionType = 'custom';
      }
    }
    
    const edgeId = `e${params.source}-${params.target}`;
    const newEdge = {
      ...params,
      id: edgeId,
      animated: true,
      data: { 
        conditionType: defaultConditionType, 
        label: defaultLabel 
      },
      label: defaultLabel,
      style: { stroke: '#9b87f5', strokeWidth: 2 }
    };
    setEdges((eds) => addEdge(newEdge as Edge, eds));
  }, [nodes, setEdges]);
  
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
  
  const addNode = useCallback((type: ServiceType) => {
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

    let nodeData: {
      type: ServiceType;
      label: string;
      config: Record<string, any>;
      logicType?: LogicType;
    } = { 
      type, 
      label: type, 
      config: {} 
    };
    
    if (type === 'ConditionalLogic') {
      nodeData.logicType = 'Success';
    }

    const newNode: Node = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type: 'serviceNode',
      position,
      data: nodeData,
    };

    setNodes((nds) => [...nds, newNode]);
    
    if (type === 'ConditionalLogic') {
      toast({
        title: "Conditional Logic Added",
        description: "Click on the node to configure the logic type using the dropdown menu.",
      });
    }
  }, [nodes, reactFlowInstance, setNodes, toast]);
  
  const clearWorkflow = useCallback(() => {
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
  }, [nodes, setNodes, setEdges]);
  
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
    
    console.log('Saving workflow:', workflow);
    localStorage.setItem('workflow', JSON.stringify(workflow));
    
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully.",
    });
  }, [nodes, edges, validateWorkflow]);
  
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
  }, [setNodes, setEdges]);
  
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
  }, [nodes, edges, validateWorkflow]);
  
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-slate-100" ref={reactFlowWrapper}>
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
        className="workflow-canvas"
        defaultEdgeOptions={{ 
          style: { strokeWidth: 2, stroke: '#9b87f5' },
          animated: true
        }}
      >
        <Controls className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg border border-slate-200/50" />
        <MiniMap 
          nodeBorderRadius={8} 
          className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg border border-slate-200/50" 
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'WebApp': return '#60a5fa'; // blue
              case 'IDV': return '#4ade80'; // green
              case 'Media': return '#c084fc'; // purple
              case 'PII': return '#f472b6'; // pink
              case 'ConditionalLogic': return '#fbbf24'; // amber
              default: return '#94a3b8'; // slate
            }
          }}
        />
        <Background gap={20} size={1} color="#e2e8f0" className="bg-white/30" />
        
        <Panel position="bottom-center" className="p-2">
          <Button 
            variant="default" 
            onClick={validateWorkflow}
            className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-md px-6"
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
