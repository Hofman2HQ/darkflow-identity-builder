
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, ScanFace, 
  CheckSquare, XSquare, GitBranch,
  CheckCircle, XCircle, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceType = 
  | 'WebApp'
  | 'IDV'
  | 'Media'
  | 'PII'
  | 'AML'
  | 'KYB'
  | 'POA'
  | 'AnyDoc'
  | 'AgeEstimation'
  | 'Liveness'
  | 'FaceCompare'
  | 'OBI'
  | 'TextNode'
  | 'ConditionalLogic'; 

export type LogicType = 'Success' | 'Failed' | 'Conditional' | 'Indecisive';

interface ServiceNodeProps {
  id: string;
  data: {
    type: ServiceType;
    label: string;
    config?: Record<string, any>;
    isValid?: boolean;
    isEntry?: boolean;
    logicType?: LogicType;
  };
  selected: boolean;
}

const getServiceIcon = (type: ServiceType, logicType?: LogicType) => {
  // For ConditionalLogic nodes, show different icons based on the logicType
  if (type === 'ConditionalLogic' && logicType) {
    switch (logicType) {
      case 'Success': return <CheckCircle className="text-green-400" />;
      case 'Failed': return <XCircle className="text-red-400" />;
      case 'Conditional': return <GitBranch className="text-amber-400" />;
      case 'Indecisive': return <HelpCircle className="text-blue-400" />;
      default: return <GitBranch className="text-amber-400" />;
    }
  }

  switch (type) {
    case 'WebApp': return <AppWindow className="text-blue-400" />;
    case 'IDV': return <Shield className="text-green-400" />;
    case 'Media': return <Camera className="text-purple-400" />;
    case 'PII': return <User className="text-pink-400" />;
    case 'AML': return <Shield className="text-red-400" />;
    case 'KYB': return <Briefcase className="text-orange-400" />;
    case 'POA': return <FileText className="text-yellow-400" />;
    case 'AnyDoc': return <FileText className="text-blue-400" />;
    case 'AgeEstimation': return <Cake className="text-teal-400" />;
    case 'Liveness': return <Scan className="text-indigo-400" />;
    case 'FaceCompare': return <ScanFace className="text-cyan-400" />; 
    case 'OBI': return <CheckSquare className="text-emerald-400" />;
    case 'TextNode': return <FileText className="text-gray-400" />;
    case 'ConditionalLogic': return <GitBranch className="text-amber-400" />;
    default: return <XSquare className="text-gray-400" />;
  }
}

const getLogicTypeClass = (logicType?: LogicType) => {
  if (!logicType) return '';
  
  switch (logicType) {
    case 'Success': return 'border-green-500/40 bg-green-500/10';
    case 'Failed': return 'border-red-500/40 bg-red-500/10';
    case 'Conditional': return 'border-amber-500/40 bg-amber-500/10';
    case 'Indecisive': return 'border-blue-500/40 bg-blue-500/10';
    default: return 'border-amber-500/40';
  }
}

const ServiceNode = memo(({ id, data, selected }: ServiceNodeProps) => {
  const { type, label, isValid = true, isEntry = false, logicType } = data;
  
  return (
    <div
      className={cn(
        'service-node',
        !isValid && 'invalid',
        isValid && !isEntry && 'valid',
        selected && 'ring-2 ring-primary/50',
        type === 'ConditionalLogic' && getLogicTypeClass(logicType)
      )}
    >
      {!isEntry && (
        <Handle
          type="target"
          position={Position.Top}
          className="!top-0"
          id={`${id}-target`}
        />
      )}
      
      <div className="service-node__icon">
        {getServiceIcon(type, logicType)}
      </div>
      
      <div className="service-node__title">
        {label}
        {type === 'ConditionalLogic' && logicType && (
          <div className="text-xs opacity-70 mt-1">
            {logicType}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bottom-0"
        id={`${id}-source`}
      />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';

export default ServiceNode;
