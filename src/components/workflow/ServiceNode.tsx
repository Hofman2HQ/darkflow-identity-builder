
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export type ServiceType = 'WebApp' | 'IDV' | 'Media' | 'PII' | 'POA' | 'AnyDoc' | 'AgeEstimation' | 'Liveness' | 
  'FaceCompare' | 'OBI' | 'StartNode' | 'EndNode' | 'ConditionalLogic' | 'TextNode' | 'DescriptionBox' | 'AML' | 
  'KYB' | 'Condition';

export type LogicType = 'Success' | 'Failure' | 'Timeout' | 'Custom';

export interface ServiceNodeProps {
  id: string;
  data: {
    type: ServiceType;
    label: string;
    config?: any;
    isValid?: boolean;
    isEntry?: boolean;
    logicType?: LogicType;
    description?: string;
    fontSize?: number;
    conditions?: Array<{
      service: string;
      component: string;
      function: string;
      value: string;
    }>;
    [key: string]: any;
  };
  selected: boolean;
}

const ServiceNode: React.FC<ServiceNodeProps> = memo(({ id, data, selected }) => {
  const { 
    type, 
    label, 
    isValid = true, 
    isEntry = false, 
    logicType = 'Success', 
    description, 
    fontSize = 16,
    conditions = []
  } = data;

  // Special case for description box - make transparent
  if (type === 'DescriptionBox') {
    return (
      <>
        <div
          className="service-node bg-transparent border-0 shadow-none text-left"
          data-type={type}
          data-valid={isValid}
        >
          <div 
            className="service-node__description"
            style={{ 
              fontSize: `${fontSize}px`,
              color: selected ? '#9b87f5' : '#fff',
              textShadow: '0 0 4px rgba(0,0,0,0.5)'
            }}
          >
            {description}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ visibility: 'hidden' }}
          isConnectable={true}
        />
      </>
    );
  }
  
  // Special case for Condition node
  if (type === 'Condition') {
    // Create a summary of conditions
    const conditionSummary = conditions.map((condition, index) => (
      <div key={index} className="text-xs text-center mt-1 font-medium">
        {`${condition.service} ${condition.function} ${condition.value}`}
      </div>
    ));
    
    return (
      <>
        <Handle 
          type="target" 
          position={Position.Left} 
          id="target" 
          className={`w-2 h-2 ${selected ? 'bg-primary' : ''}`}
          isConnectable={true}
        />
        <div 
          className={`service-node ${!isValid ? 'invalid' : ''} transition-all duration-300 ${selected ? 'scale-110' : ''}`}
          data-type={type}
          data-valid={isValid}
        >
          <div className="service-node__icon bg-amber-500/40 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5"></path>
              <path d="M8 3H3v5"></path>
              <path d="M21 16v5h-5"></path>
              <path d="M16 16L8 8"></path>
              <path d="M3 16v5h5"></path>
            </svg>
          </div>
          <div className="service-node__title text-sm font-medium">
            {label}
          </div>
          <div className="service-node__conditions text-xs opacity-70">
            {conditionSummary}
          </div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="match" 
          style={{ top: '35%' }} 
          className={`w-2 h-2 ${selected ? 'bg-green-500' : ''}`}
          isConnectable={true}
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="notMatch" 
          style={{ top: '70%' }} 
          className={`w-2 h-2 ${selected ? 'bg-red-500' : ''}`}
          isConnectable={true}
        />
        
        {/* Labels for the handles */}
        <div 
          style={{ 
            position: 'absolute', 
            right: '-50px', 
            top: '35%', 
            transform: 'translateY(-50%)',
            fontSize: '10px',
            color: selected ? '#4ade80' : '#6b7280'
          }}
        >
          Match
        </div>
        <div 
          style={{ 
            position: 'absolute', 
            right: '-65px', 
            top: '70%', 
            transform: 'translateY(-50%)',
            fontSize: '10px',
            color: selected ? '#f87171' : '#6b7280'
          }}
        >
          Not Match
        </div>
      </>
    );
  }

  // Base style classes for the node
  let baseNodeClasses = `service-node neo-blur ${!isValid ? 'invalid' : ''} transition-all duration-300 ${selected ? 'scale-105' : ''}`;
  
  // Additional style based on node type
  const nodeTypeClass = {
    StartNode: 'from-green-500/20 to-green-700/20 border-green-500/30',
    EndNode: 'from-red-500/20 to-red-700/20 border-red-500/30',
    WebApp: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
    IDV: 'from-green-500/20 to-green-700/20 border-green-500/30',
    Media: 'from-purple-500/20 to-purple-700/20 border-purple-500/30',
    PII: 'from-pink-500/20 to-pink-700/20 border-pink-500/30',
    ConditionalLogic: 'from-amber-500/20 to-amber-700/20 border-amber-500/30',
    AML: 'from-red-500/20 to-red-700/20 border-red-500/30',
    KYB: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
    Condition: 'from-yellow-500/20 to-yellow-700/20 border-yellow-500/30',
    TextNode: 'from-gray-500/20 to-gray-700/20 border-gray-500/30',
  };
  
  const nodeClass = `${baseNodeClasses} bg-gradient-to-br ${nodeTypeClass[type] || 'from-gray-500/20 to-gray-700/20 border-gray-500/30'}`;
  
  return (
    <>
      {!isEntry && (
        <Handle
          type="target"
          position={Position.Left}
          className={`w-2 h-2 ${selected ? 'bg-primary' : ''}`}
          isConnectable={true}
        />
      )}
      <div 
        className={nodeClass}
        data-type={type}
        data-valid={isValid}
      >
        <div className={`service-node__icon ${selected ? 'animate-pulse' : ''}`}>
          {type === 'ConditionalLogic' && (
            <div className="text-xs py-1 px-2 rounded-full bg-amber-500/40 text-white">
              {logicType}
            </div>
          )}
        </div>
        <div className="service-node__title text-base font-medium">
          {label}
        </div>
      </div>
      {type !== 'EndNode' && (
        <Handle
          type="source"
          position={Position.Right}
          className={`w-2 h-2 ${selected ? 'bg-primary' : ''}`}
          isConnectable={true}
        />
      )}
    </>
  );
});

export default ServiceNode;
