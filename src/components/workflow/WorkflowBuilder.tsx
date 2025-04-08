
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
  Panel,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

import ServiceNode, { ServiceType, LogicType } from './ServiceNode';
import ControlPanel from './ControlPanel';
import NodeConfigPanel from './NodeConfigPanel';
import ConnectionConfigPanel from './ConnectionConfigPanel';
import { toast } from '@/hooks/use-toast';
import { useTheme } from './ThemeProvider';
import { Theme } from './ThemeProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Define the structure of the node config
interface NodeConfig {
  appId?: string;
  flowName?: string;
  idTypes?: string;
  requireSelfie?: boolean;
  debugMode?: boolean;
  testFlags?: string;
  extraNotes?: string;
  timeout?: number;
  [key: string]: any;
}

// NodeData type for the data property of Node
interface FlowNodeData {
  type: string;
  label: string;
  config?: NodeConfig;
  isValid?: boolean;
  isEntry?: boolean;
  logicType?: LogicType;
  description?: string;
  [key: string]: any; // Add index signature for string keys
}

const nodeTypes: NodeTypes = {
  serviceNode: ServiceNode,
};

const initialNodes: Node<FlowNodeData>[] = [
  {
    id: 'start-node',
    type: 'serviceNode',
    position: { x: 250, y: 50 },
    data: { 
      type: 'StartNode', 
      label: 'Start', 
      isEntry: true,
    },
  },
  {
    id: 'webapp-1',
    type: 'serviceNode',
    position: { x: 250, y: 150 },
    data: { 
      type: 'WebApp', 
      label: 'WebApp Entry', 
      config: { appId: 'default-app', flowName: 'ID Verification Flow' }
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-start-webapp',
    source: 'start-node',
    target: 'webapp-1',
    animated: true,
    style: { stroke: '#9b87f5', strokeWidth: 2 }
  }
];

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState<boolean>(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  
  // Keyboard event handler for deleting selected nodes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNode) {
        // Don't allow deleting the Start node
        if (selectedNode.data.type === 'StartNode') {
          toast({
            title: "Cannot Delete Start Node",
            description: "The Start node is required and cannot be deleted.",
            variant: "destructive"
          });
          return;
        }
        
        // Delete the node and its connected edges
        setNodes(nodes.filter(n => n.id !== selectedNode.id));
        setEdges(edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
        
        toast({
          title: "Node Deleted",
          description: `The ${selectedNode.data.label || selectedNode.data.type} node has been removed.`,
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, nodes, edges, setNodes, setEdges]);
  
  const validateWorkflow = useCallback(() => {
    // Check for start node
    const startNodes = nodes.filter(n => n.data.type === 'StartNode');
    const hasOneStartNode = startNodes.length === 1;
    
    // Check for end nodes
    const endNodes = nodes.filter(n => n.data.type === 'EndNode');
    const hasEndNode = endNodes.length >= 1;
    
    // Check for WebApp node
    const webAppNodes = nodes.filter(n => n.data.type === 'WebApp');
    const hasOneWebApp = webAppNodes.length === 1;
    
    const updatedNodes = nodes.map(node => {
      let isValid = true;
      
      // Start node validation
      if (node.data.type === 'StartNode' && !hasOneStartNode) {
        isValid = false;
      }
      
      // WebApp validation
      if (node.data.type === 'WebApp' && !hasOneWebApp) {
        isValid = false;
      }
      
      // Check nodes have incoming connections (except start, webapp, description box, and text nodes)
      if (node.data.type !== 'StartNode' && 
          node.data.type !== 'WebApp' && 
          node.data.type !== 'TextNode' &&
          node.data.type !== 'DescriptionBox') {
        const hasIncoming = edges.some(e => e.target === node.id);
        if (!hasIncoming) {
          isValid = false;
        }
      }
      
      // End nodes should have incoming but no outgoing connections
      if (node.data.type === 'EndNode') {
        const hasIncoming = edges.some(e => e.target === node.id);
        const hasOutgoing = edges.some(e => e.source === node.id);
        
        if (!hasIncoming || hasOutgoing) {
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
    
    // Check overall workflow validity
    let isWorkflowValid = hasOneStartNode && hasEndNode;
    
    if (!hasOneStartNode) {
      toast({
        title: "Workflow Validation",
        description: "Workflow must have exactly one Start node.",
        variant: "destructive"
      });
      isWorkflowValid = false;
    }
    
    if (!hasEndNode) {
      toast({
        title: "Workflow Validation",
        description: "Workflow must have at least one End node.",
        variant: "destructive"
      });
      isWorkflowValid = false;
    }
    
    const invalidNodesCount = updatedNodes.filter(n => !n.data.isValid).length;
    if (invalidNodesCount > 0) {
      toast({
        title: "Workflow Validation",
        description: `Found ${invalidNodesCount} issues in your workflow. Hover over nodes for details.`,
        variant: "destructive"
      });
      isWorkflowValid = false;
    }
    
    return isWorkflowValid;
  }, [nodes, edges, setNodes]);
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<FlowNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);
  
  // Node double-click handler to open the config panel
  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node<FlowNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setConfigPanelOpen(true);
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
    // Check if trying to connect from an End node (which is not allowed)
    const sourceNode = nodes.find(n => n.id === params.source);
    if (sourceNode?.data.type === 'EndNode') {
      toast({
        title: "Connection not allowed",
        description: "End nodes cannot have outgoing connections.",
        variant: "destructive"
      });
      return;
    }
    
    // Simplified connection - no labels or extra properties, just animated edges
    const edgeId = `e${params.source}-${params.target}`;
    const newEdge = {
      ...params,
      id: edgeId,
      animated: true,
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
    setConfigPanelOpen(false);
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
          };
        }
        return edge;
      })
    );
  }, [setEdges]);
  
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter(e => e.id !== edgeId));
    setSelectedEdge(null);
    toast({
      title: "Connection Deleted",
      description: "The connection has been removed from your workflow.",
    });
  }, [setEdges]);
  
  const addNode = useCallback((type: ServiceType) => {
    // Handle special node types
    if (type === 'StartNode' && nodes.some(n => n.data.type === 'StartNode')) {
      toast({
        title: "Cannot add Start Node",
        description: "Only one Start node is allowed in the workflow.",
        variant: "destructive"
      });
      return;
    }
    
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

    let nodeData: FlowNodeData = { 
      type, 
      label: type === 'StartNode' ? 'Start' : 
             type === 'EndNode' ? 'End' : 
             type === 'DescriptionBox' ? 'Description' : type, 
      config: {} 
    };
    
    if (type === 'ConditionalLogic') {
      nodeData.logicType = 'Success';
    }
    
    if (type === 'DescriptionBox') {
      nodeData.description = 'Add your description here...';
    }

    const newNode: Node<FlowNodeData> = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type: 'serviceNode',
      position,
      data: nodeData,
    };

    setNodes((nds) => [...nds, newNode]);
    
    if (type === 'EndNode') {
      toast({
        title: "End Node Added",
        description: "End nodes cannot have outgoing connections.",
      });
    } else if (type === 'ConditionalLogic') {
      toast({
        title: "Conditional Logic Added",
        description: "Click on the node to configure the logic type.",
      });
    } else if (type === 'DescriptionBox') {
      toast({
        title: "Description Box Added",
        description: "Click on the box to edit the description text.",
      });
    }
  }, [nodes, reactFlowInstance, setNodes]);
  
  const clearWorkflow = useCallback(() => {
    // Keep only the Start node or create one if it doesn't exist
    const startNode = nodes.find(n => n.data.type === 'StartNode');
    
    if (startNode) {
      setNodes([startNode]);
    } else {
      // Create a new Start node
      setNodes([{
        id: 'start-node',
        type: 'serviceNode',
        position: { x: 250, y: 50 },
        data: { 
          type: 'StartNode', 
          label: 'Start', 
          isEntry: true,
        },
      }]);
    }
    
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    
    toast({
      title: "Workflow Cleared",
      description: "All nodes except the Start node have been removed.",
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
        
        // Verify if imported workflow has a Start node
        const hasStartNode = savedNodes.some((node: any) => node.data.type === 'StartNode');
        
        if (!hasStartNode) {
          // Add a Start node if missing
          savedNodes.unshift({
            id: 'start-node',
            type: 'serviceNode',
            position: { x: 250, y: 50 },
            data: { 
              type: 'StartNode', 
              label: 'Start', 
              isEntry: true,
            },
          });
        }
        
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
    
    // Transform the nodes to proper JSON format for export
    const processedNodes = nodes.map(node => {
      // For description boxes, format specially
      if (node.data.type === 'DescriptionBox') {
        return {
          ...node,
          data: {
            ...node.data,
            type: 'note',
            text: node.data.description || ''
          }
        };
      }
      
      // For Start and End nodes, add special type tags
      if (node.data.type === 'StartNode') {
        return {
          ...node,
          data: {
            ...node.data,
            typeTag: 'start'
          }
        };
      }
      
      if (node.data.type === 'EndNode') {
        return {
          ...node,
          data: {
            ...node.data,
            typeTag: 'end'
          }
        };
      }
      
      return node;
    });
    
    const workflow = {
      nodes: processedNodes,
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
    <div className={`h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-slate-800' : 'bg-gradient-to-br from-indigo-50 to-slate-100'}`} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        onInit={setReactFlowInstance}
        className={`workflow-canvas ${theme === 'dark' ? 'dark-flow' : ''}`}
        defaultEdgeOptions={{ 
          style: { strokeWidth: 2, stroke: theme === 'dark' ? '#9b87f5' : '#9b87f5' },
          animated: true
        }}
      >
        <Controls className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm shadow-md rounded-lg border ${theme === 'dark' ? 'border-gray-700/50' : 'border-slate-200/50'}`} />
        <MiniMap 
          nodeBorderRadius={8} 
          className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm shadow-md rounded-lg border ${theme === 'dark' ? 'border-gray-700/50' : 'border-slate-200/50'}`}
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'StartNode': return theme === 'dark' ? '#4ade80' : '#4ade80'; // green
              case 'EndNode': return theme === 'dark' ? '#f87171' : '#f87171'; // red
              case 'DescriptionBox': return theme === 'dark' ? '#93c5fd' : '#93c5fd'; // light blue
              case 'WebApp': return theme === 'dark' ? '#60a5fa' : '#60a5fa'; // blue
              case 'IDV': return theme === 'dark' ? '#4ade80' : '#4ade80'; // green
              case 'Media': return theme === 'dark' ? '#c084fc' : '#c084fc'; // purple
              case 'PII': return theme === 'dark' ? '#f472b6' : '#f472b6'; // pink
              case 'ConditionalLogic': return theme === 'dark' ? '#fbbf24' : '#fbbf24'; // amber
              case 'TextNode': return theme === 'dark' ? '#94a3b8' : '#94a3b8'; // slate for text nodes
              default: return theme === 'dark' ? '#94a3b8' : '#94a3b8'; // slate
            }
          }}
        />
        <Background 
          gap={20} 
          size={1} 
          color={theme === 'dark' ? '#374151' : '#e2e8f0'} 
          className={theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/30'} 
        />
        
        <Panel position="bottom-center" className="p-2">
          <Button 
            variant="default" 
            onClick={validateWorkflow}
            className={`${theme === 'dark' 
              ? 'bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90' 
              : 'bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90'} 
              shadow-md px-6`}
          >
            Validate Workflow
          </Button>
        </Panel>
        
        <Panel position="top-right" className="p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-white text-indigo-600'}`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Panel>
      </ReactFlow>
      
      <ControlPanel
        onAddNode={addNode}
        onClear={clearWorkflow}
        onSave={saveWorkflow}
        onImport={importWorkflow}
        onExport={exportWorkflow}
        theme={theme}
      />
      
      {selectedEdge && (
        <ConnectionConfigPanel
          edge={selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onUpdate={updateEdgeData}
          onDelete={deleteEdge}
          theme={theme}
        />
      )}
      
      {/* Dialog for node configuration */}
      <Dialog open={configPanelOpen} onOpenChange={setConfigPanelOpen}>
        <DialogContent className={`${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''} max-w-md`}>
          <DialogHeader>
            <DialogTitle>Configure Node</DialogTitle>
          </DialogHeader>
          {selectedNode && (
            <NodeConfigPanel
              node={selectedNode}
              onClose={() => setConfigPanelOpen(false)}
              onUpdate={updateNodeData}
              theme={theme}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowBuilder;
