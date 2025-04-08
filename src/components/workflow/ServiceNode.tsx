
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';

export type LogicType = 'Success' | 'Failed' | 'Conditional' | 'Indecisive' | 'Custom';
export type ServiceType = 'WebApp' | 'StartNode' | 'EndNode' | 'IDV' | 'Media' | 'PII' | 'Consent' | 'ConditionalLogic' | 'TextNode' | 'DescriptionBox';

const ServiceNode = memo(({ id, data, selected, isConnectable }: any) => {
  const { type, label, isValid, logicType, description } = data;
  
  const getBorderColor = () => {
    if (selected) return '#9b87f5'; // purple for selected
    if (isValid === false) return '#ef4444'; // red for invalid
    if (type === 'EndNode') return '#f87171'; // light red for end node
    if (type === 'StartNode') return '#4ade80'; // green for start node
    return '#cbd5e1'; // default slate gray
  };
  
  const getBgColor = () => {
    if (type === 'DescriptionBox') return 'transparent'; // Transparent for description box
    if (isValid === false) return '#fee2e2'; // light red for invalid
    if (type === 'EndNode') return '#fef2f2'; // very light red for end
    if (type === 'StartNode') return '#f0fdf4'; // very light green for start
    if (type === 'TextNode') return 'transparent'; // transparent for text node
    if (type === 'WebApp') return '#eff6ff'; // very light blue
    if (type === 'IDV') return '#f0fdf4'; // very light green
    if (type === 'Media') return '#faf5ff'; // very light purple
    if (type === 'PII') return '#fdf2f8'; // very light pink
    if (type === 'ConditionalLogic') return '#fffbeb'; // very light amber 
    return '#f8fafc'; // default very light slate
  };
  
  const getTextColor = () => {
    if (type === 'EndNode') return '#ef4444'; // red for end node
    if (type === 'StartNode') return '#22c55e'; // green for start
    if (type === 'WebApp') return '#3b82f6'; // blue for webapp
    if (type === 'ConditionalLogic') return '#f59e0b'; // amber for conditional logic
    if (type === 'IDV') return '#10b981'; // emerald for IDV
    if (type === 'Media') return '#8b5cf6'; // purple for media
    if (type === 'PII') return '#ec4899'; // pink for PII
    return '#64748b'; // slate for default
  };
  
  const getIconColor = () => {
    if (isValid === false) return '#ef4444'; // red for invalid
    return getTextColor();
  };
  
  const getIconType = () => {
    if (type === 'StartNode') return '➡️';
    if (type === 'EndNode') return '🛑';
    if (type === 'WebApp') return '🖥️';
    if (type === 'IDV') return '🪪';
    if (type === 'Media') return '📸';
    if (type === 'PII') return '👤';
    if (type === 'Consent') return '✓';
    if (type === 'ConditionalLogic') return '🔀';
    if (type === 'TextNode') return '📝';
    if (type === 'DescriptionBox') return '📋';
    return '📦';
  };
  
  // Special rendering for the description box
  if (type === 'DescriptionBox') {
    return (
      <div style={{ 
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: '5px'
      }}>
        <div style={{ 
          color: '#4b5563', 
          fontSize: '14px',
          fontFamily: 'sans-serif',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          maxWidth: '300px',
          cursor: 'default',
          padding: '0',
          textAlign: 'left'
        }}>
          {description || 'Description text...'}
        </div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ visibility: 'hidden' }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ visibility: 'hidden' }}
          isConnectable={isConnectable}
        />
      </div>
    );
  }
  
  // Special rendering for text nodes
  if (type === 'TextNode') {
    return (
      <div style={{ 
        background: 'transparent',
        border: selected ? `1px dashed ${getBorderColor()}` : 'none',
        borderRadius: '4px',
        padding: '5px'
      }}>
        <div style={{ 
          color: '#4b5563', 
          fontSize: '14px',
          fontFamily: 'sans-serif',
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          maxWidth: '200px',
        }}>
          {label || 'Text node...'}
        </div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ visibility: 'hidden' }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ visibility: 'hidden' }}
          isConnectable={isConnectable}
        />
      </div>
    );
  }
  
  // Logic for conditional logic node display
  const getConditionalBadge = () => {
    if (type !== 'ConditionalLogic') return null;
    
    const getBadgeColor = () => {
      switch(logicType) {
        case 'Success': return 'bg-green-100 text-green-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Conditional': return 'bg-amber-100 text-amber-800';
        case 'Indecisive': return 'bg-gray-100 text-gray-800';
        case 'Custom': return 'bg-purple-100 text-purple-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    };
    
    return (
      <div className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor()} mt-1`}>
        {logicType || 'Logic Type'}
      </div>
    );
  };
  
  return (
    <div
      className="service-node"
      style={{
        borderWidth: type === 'StartNode' || type === 'EndNode' ? '2px' : '1px',
        borderStyle: 'solid',
        borderColor: getBorderColor(),
        background: getBgColor(),
        opacity: isValid === false ? 0.8 : 1
      }}
    >
      {isValid === false && (
        <div className="absolute -top-2 -right-2">
          <AlertTriangle className="h-5 w-5 fill-red-100 text-red-600" />
        </div>
      )}
      
      <div className="service-node__icon" style={{ color: getIconColor() }}>
        {getIconType()}
      </div>
      
      <div className="service-node__title" style={{ color: getTextColor() }}>
        {label || type}
      </div>
      
      {getConditionalBadge()}
      
      {/* Only show handles for connectable nodes */}
      {type !== 'EndNode' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: getBorderColor() }}
          isConnectable={isConnectable}
        />
      )}
      
      {type !== 'StartNode' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: getBorderColor() }}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
});

export default ServiceNode;
