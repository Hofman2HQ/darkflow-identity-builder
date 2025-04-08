
import type { Node, Edge } from '@xyflow/react';

// Interfaces for the Camunda JSON format
interface CamundaWorkflow {
  startStep: string;
  steps: CamundaStep[];
}

interface CamundaStep {
  type: 'service' | 'multi_services' | 'end';
  id: string;
  service?: string;
  subSteps?: string[];
  conditions?: CamundaCondition[];
  goToStep?: string;
}

interface CamundaCondition {
  condition: string;
  goToStep: string;
}

/**
 * Transforms the React Flow nodes and edges into a Camunda-compatible workflow JSON
 */
export const transformToCamunda = (nodes: Node[], edges: Edge[]): CamundaWorkflow => {
  // Find the start node - should be of type 'StartNode'
  const startNode = nodes.find(node => node.data.type === 'StartNode');
  
  if (!startNode) {
    throw new Error('No start node found in the workflow');
  }
  
  // Create a unique end step if not already present
  const endNodes = nodes.filter(node => node.data.type === 'EndNode');
  const endSteps = endNodes.map(endNode => ({
    type: 'end',
    id: endNode.id
  } as CamundaStep));
  
  // Initialize the workflow with the startStep
  const workflow: CamundaWorkflow = {
    startStep: startNode.id,
    steps: [...endSteps] // Start with the end nodes
  };
  
  // Process each node
  nodes.forEach(node => {
    // Skip the end nodes since they're already added
    if (node.data.type === 'EndNode') return;
    
    // Skip description boxes and other non-service nodes
    if (['StartNode', 'DescriptionBox', 'TextNode'].includes(node.data.type)) return;

    // Find outgoing edges for the node
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    
    // Process parallel nodes (nodes with multiple outgoing edges to service nodes)
    const parallelEdges = outgoingEdges.filter(edge => {
      // Find the target node
      const targetNode = nodes.find(n => n.id === edge.target);
      // Check if the target is a service
      return targetNode && !['EndNode', 'StartNode', 'DescriptionBox', 'TextNode', 'ConditionalLogic', 'Condition'].includes(targetNode.data.type);
    });
    
    if (parallelEdges.length > 1 && node.data.type !== 'Condition') {
      // This is a node with multiple outgoing connections - create a multi_services step
      const subStepIds = parallelEdges.map(edge => edge.target);
      
      // Find the merge node (the node where the parallel execution joins)
      // This is likely a node that all parallel paths eventually lead to
      let mergeNodeId: string | undefined;
      
      // Find a common target among the sub-steps
      const subStepEndTargets = new Map<string, number>();
      
      // For each sub-step, find its outgoing edges
      subStepIds.forEach(subStepId => {
        const subStepOutgoingEdges = edges.filter(edge => edge.source === subStepId);
        
        subStepOutgoingEdges.forEach(edge => {
          const count = subStepEndTargets.get(edge.target) || 0;
          subStepEndTargets.set(edge.target, count + 1);
        });
      });
      
      // Find the most common target (likely the merge node)
      let maxCount = 0;
      subStepEndTargets.forEach((count, targetId) => {
        if (count > maxCount) {
          maxCount = count;
          mergeNodeId = targetId;
        }
      });
      
      workflow.steps.push({
        type: 'multi_services',
        id: node.id,
        subSteps: subStepIds,
        goToStep: mergeNodeId
      });
      
    } else if (node.data.type === 'Condition') {
      // Handle condition nodes differently
      const matchEdge = outgoingEdges.find(edge => edge.sourceHandle === 'match');
      const notMatchEdge = outgoingEdges.find(edge => edge.sourceHandle === 'notMatch');
      
      const conditions: CamundaCondition[] = [];
      
      if (matchEdge && matchEdge.data?.camundaCondition) {
        conditions.push({
          condition: matchEdge.data.camundaCondition,
          goToStep: matchEdge.target
        });
      } else if (matchEdge) {
        conditions.push({
          condition: "${true}", // Default condition for match
          goToStep: matchEdge.target
        });
      }
      
      // Default path is the notMatch edge or undefined
      const goToStep = notMatchEdge?.target;
      
      workflow.steps.push({
        type: 'service',
        id: node.id,
        service: 'condition', // Special service type for conditions
        conditions,
        goToStep
      });
      
    } else {
      // For regular service nodes
      const serviceStep: CamundaStep = {
        type: 'service',
        id: node.id,
        service: node.data.type.toLowerCase()
      };
      
      if (outgoingEdges.length > 0) {
        // Check if there are conditions on the edges
        const conditionalEdges = outgoingEdges.filter(edge => edge.data?.conditionType && edge.data.conditionType !== 'always');
        
        if (conditionalEdges.length > 0) {
          const conditions: CamundaCondition[] = conditionalEdges.map(edge => {
            let condition = "${true}"; // Default condition
            
            if (edge.data?.camundaCondition) {
              condition = edge.data.camundaCondition;
            } else if (edge.data?.conditionType === 'match') {
              condition = "${result.success == true}";
            } else if (edge.data?.conditionType === 'nomatch') {
              condition = "${result.success == false}";
            } else if (edge.data?.conditionType === 'custom' && edge.data?.customLogic) {
              condition = `\${${edge.data.customLogic}}`;
            }
            
            return {
              condition,
              goToStep: edge.target
            };
          });
          
          serviceStep.conditions = conditions;
        }
        
        // Find the default edge (without condition or 'always' condition)
        const defaultEdge = outgoingEdges.find(edge => !edge.data?.conditionType || edge.data.conditionType === 'always');
        
        if (defaultEdge) {
          serviceStep.goToStep = defaultEdge.target;
        }
      }
      
      workflow.steps.push(serviceStep);
    }
  });
  
  return workflow;
};

/**
 * Validates the workflow before exporting
 */
export const validateCamundaWorkflow = (workflow: CamundaWorkflow): string[] => {
  const errors: string[] = [];
  
  // Check if all steps have ids
  const stepsWithoutIds = workflow.steps.filter(step => !step.id);
  if (stepsWithoutIds.length > 0) {
    errors.push(`Found ${stepsWithoutIds.length} steps without IDs`);
  }
  
  // Check for service steps without service
  const serviceStepsWithoutService = workflow.steps.filter(
    step => step.type === 'service' && !step.service
  );
  if (serviceStepsWithoutService.length > 0) {
    errors.push(`Found ${serviceStepsWithoutService.length} service steps without a service type`);
  }
  
  // Check for steps with conditions but no default goToStep
  const stepsWithConditionsButNoDefault = workflow.steps.filter(
    step => step.conditions && step.conditions.length > 0 && !step.goToStep
  );
  if (stepsWithConditionsButNoDefault.length > 0) {
    errors.push(`Found ${stepsWithConditionsButNoDefault.length} steps with conditions but no default goToStep`);
  }
  
  // Check if all referenced steps exist
  const stepIds = new Set(workflow.steps.map(step => step.id));
  
  // Check if startStep exists
  if (!stepIds.has(workflow.startStep)) {
    errors.push(`Start step ${workflow.startStep} does not exist in the workflow`);
  }
  
  // Check all goToStep references
  workflow.steps.forEach(step => {
    if (step.goToStep && !stepIds.has(step.goToStep)) {
      errors.push(`Step ${step.id} references non-existent goToStep ${step.goToStep}`);
    }
    
    if (step.conditions) {
      step.conditions.forEach(condition => {
        if (!stepIds.has(condition.goToStep)) {
          errors.push(`Step ${step.id} has a condition referencing non-existent goToStep ${condition.goToStep}`);
        }
      });
    }
    
    if (step.type === 'multi_services' && step.subSteps) {
      step.subSteps.forEach(subStepId => {
        if (!stepIds.has(subStepId)) {
          errors.push(`Multi-service step ${step.id} references non-existent subStep ${subStepId}`);
        }
      });
    }
  });
  
  return errors;
};
