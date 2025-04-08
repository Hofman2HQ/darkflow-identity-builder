
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export type LogicType = 'Success' | 'Failed' | 'Conditional' | 'Indecisive' | 'Custom';
export type ServiceType = 'WebApp' | 'StartNode' | 'EndNode' | 'IDV' | 'Media' | 'PII' | 'Consent' | 'ConditionalLogic' | 'TextNode' | 'DescriptionBox';

const ServiceNode = memo(({ id, data, selected, isConnectable }: any) => {
  const { type, label, isValid, logicType, description } = data;
  const [fontSize, setFontSize] = useState<number>(14); // Default font size
  
  const getBorderColor = () => {
    if (selected) return 'rgba(155, 135, 245, 0.9)'; // purple for selected
    if (isValid === false) return 'rgba(239, 68, 68, 0.9)'; // red for invalid
    if (type === 'EndNode') return 'rgba(248, 113, 113, 0.9)'; // light red for end node
    if (type === 'StartNode') return 'rgba(74, 222, 128, 0.9)'; // green for start node
    return 'rgba(203, 213, 225, 0.6)'; // default slate gray with transparency
  };
  
  const getBgGradient = () => {
    if (type === 'DescriptionBox') return 'transparent'; // Transparent for description box
    if (isValid === false) return 'linear-gradient(135deg, rgba(254, 226, 226, 0.6), rgba(254, 202, 202, 0.4))'; // light red for invalid
    if (type === 'EndNode') return 'linear-gradient(135deg, rgba(254, 242, 242, 0.7), rgba(249, 168, 168, 0.4))'; // very light red for end
    if (type === 'StartNode') return 'linear-gradient(135deg, rgba(240, 253, 244, 0.7), rgba(134, 239, 172, 0.4))'; // very light green for start
    if (type === 'WebApp') return 'linear-gradient(135deg, rgba(239, 246, 255, 0.7), rgba(147, 197, 253, 0.4))'; // very light blue
    if (type === 'IDV') return 'linear-gradient(135deg, rgba(240, 253, 244, 0.7), rgba(134, 239, 172, 0.4))'; // very light green
    if (type === 'Media') return 'linear-gradient(135deg, rgba(250, 245, 255, 0.7), rgba(216, 180, 254, 0.4))'; // very light purple
    if (type === 'PII') return 'linear-gradient(135deg, rgba(253, 242, 248, 0.7), rgba(249, 168, 212, 0.4))'; // very light pink
    if (type === 'ConditionalLogic') return 'linear-gradient(135deg, rgba(255, 251, 235, 0.7), rgba(252, 211, 77, 0.4))'; // very light amber 
    return 'linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(226, 232, 240, 0.4))'; // default very light slate
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
  
  const increaseTextSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)); // Max size 24px
  };
  
  const decreaseTextSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10)); // Min size 10px
  };
  
  // Special rendering for the description box
  if (type === 'DescriptionBox') {
    return (
      <div style={{ 
        background: 'transparent',
        border: selected ? `1px dashed ${getBorderColor()}` : 'none',
        boxShadow: selected ? '0 0 15px rgba(155, 135, 245, 0.3)' : 'none',
        padding: '5px',
        position: 'relative',
        minWidth: '150px',
        maxWidth: '300px',
      }}>
        <div style={{ 
          color: selected ? '#f8fafc' : '#e2e8f0', 
          fontSize: `${fontSize}px`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          cursor: 'default',
          padding: '4px',
          textAlign: 'left',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {description || 'Description text...'}
        </div>
        
        {selected && (
          <div style={{
            position: 'absolute',
            right: '0px',
            top: '0px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '4px',
            padding: '2px',
          }}>
            <button 
              onClick={increaseTextSize} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
              title="Increase font size"
            >
              <ChevronUp size={14} color="#e2e8f0" />
            </button>
            <button 
              onClick={decreaseTextSize} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
              title="Decrease font size"
            >
              <ChevronDown size={14} color="#e2e8f0" />
            </button>
          </div>
        )}
        
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
        padding: '5px',
        boxShadow: selected ? '0 0 15px rgba(155, 135, 245, 0.3)' : 'none',
      }}>
        <div style={{ 
          color: '#e2e8f0', 
          fontSize: `${fontSize}px`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          maxWidth: '200px',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {label || 'Text node...'}
        </div>
        
        {selected && (
          <div style={{
            position: 'absolute',
            right: '2px',
            top: '0px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '4px',
            padding: '2px',
          }}>
            <button 
              onClick={increaseTextSize} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
              title="Increase font size"
            >
              <ChevronUp size={14} color="#e2e8f0" />
            </button>
            <button 
              onClick={decreaseTextSize} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' }}
              title="Decrease font size"
            >
              <ChevronDown size={14} color="#e2e8f0" />
            </button>
          </div>
        )}
        
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
        background: getBgGradient(),
        opacity: isValid === false ? 0.8 : 1,
        borderRadius: '12px',
        padding: '10px 14px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: selected 
          ? `0 0 0 1px ${getBorderColor()}, 0 0 20px rgba(155, 135, 245, 0.4)` 
          : '0 4px 10px rgba(0, 0, 0, 0.15)',
        minWidth: '130px',
        maxWidth: '200px',
        textAlign: 'center',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s ease-in-out, transform 0.1s ease-in-out',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      {isValid === false && (
        <div className="absolute -top-2 -right-2">
          <AlertTriangle className="h-5 w-5 fill-red-100 text-red-600" />
        </div>
      )}
      
      <div className="service-node__icon" 
        style={{ 
          color: getIconColor(), 
          fontSize: '20px', 
          marginBottom: '4px',
          textShadow: '0 0 10px rgba(255,255,255,0.3)'
        }}>
        {getIconType()}
      </div>
      
      <div className="service-node__title" 
        style={{ 
          color: getTextColor(), 
          fontWeight: '500', 
          marginBottom: type === 'ConditionalLogic' ? '2px' : '0px',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
        {label || type}
      </div>
      
      {getConditionalBadge()}
      
      {/* Only show handles for connectable nodes */}
      {type !== 'EndNode' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ 
            background: getBorderColor(),
            boxShadow: '0 0 5px rgba(155, 135, 245, 0.5)'
          }}
          isConnectable={isConnectable}
        />
      )}
      
      {type !== 'StartNode' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ 
            background: getBorderColor(),
            boxShadow: '0 0 5px rgba(155, 135, 245, 0.5)'
          }}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
});

export default ServiceNode;
