
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, ScanFace, 
  CheckSquare, XSquare, GitBranch,
  CheckCircle, XCircle, HelpCircle, Settings
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

export type LogicType = 'Success' | 'Failed' | 'Conditional' | 'Indecisive' | 'Custom';

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
      case 'Custom': return <Settings className="text-purple-400" />;
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
    case 'Custom': return 'border-purple-500/40 bg-purple-500/10';
    default: return 'border-amber-500/40';
  }
}

const getNodeTypeBackground = (type: ServiceType) => {
  switch (type) {
    case 'WebApp': return 'from-blue-500/20 to-blue-400/5';
    case 'IDV': return 'from-green-500/20 to-green-400/5';
    case 'Media': return 'from-purple-500/20 to-purple-400/5';
    case 'PII': return 'from-pink-500/20 to-pink-400/5';
    case 'AML': return 'from-red-500/20 to-red-400/5';
    case 'KYB': return 'from-orange-500/20 to-orange-400/5';
    case 'POA': return 'from-yellow-500/20 to-yellow-400/5';
    case 'AnyDoc': return 'from-blue-500/20 to-blue-400/5';
    case 'AgeEstimation': return 'from-teal-500/20 to-teal-400/5';
    case 'Liveness': return 'from-indigo-500/20 to-indigo-400/5';
    case 'FaceCompare': return 'from-cyan-500/20 to-cyan-400/5';
    case 'OBI': return 'from-emerald-500/20 to-emerald-400/5';
    case 'TextNode': return 'from-gray-500/20 to-gray-400/5';
    default: return 'from-slate-500/20 to-slate-400/5';
  }
}

const ServiceNode = memo(({ id, data, selected }: ServiceNodeProps) => {
  const { type, label, isValid = true, isEntry = false, logicType } = data;
  
  return (
    <div
      className={cn(
        'service-node relative flex flex-col items-center p-3 rounded-xl border-2',
        !isValid && 'border-red-500 bg-red-100/20',
        isValid && !isEntry && type !== 'ConditionalLogic' && 'border-gray-200 bg-gradient-to-br',
        isEntry && 'border-blue-500/70 from-blue-500/30 to-blue-500/5 bg-gradient-to-br',
        type !== 'ConditionalLogic' && getNodeTypeBackground(type),
        selected && 'ring-2 ring-primary/70',
        type === 'ConditionalLogic' && getLogicTypeClass(logicType),
        'shadow-md hover:shadow-xl transition-all duration-200'
      )}
    >
      {!isEntry && (
        <Handle
          type="target"
          position={Position.Top}
          className="!top-0 w-3 h-3 bg-gray-300 hover:bg-primary"
          id={`${id}-target`}
        />
      )}
      
      <div className={cn(
        "service-node__icon p-2.5 rounded-full",
        type === 'ConditionalLogic' ? 'bg-gray-50/80' : 'bg-white shadow-sm'
      )}>
        {getServiceIcon(type, logicType)}
      </div>
      
      <div className="service-node__title text-center mt-2 font-medium text-sm">
        {label}
        {type === 'ConditionalLogic' && logicType && (
          <div className="text-xs opacity-80 mt-1 px-2 py-0.5 rounded-full bg-gray-100/70 backdrop-blur-sm">
            {logicType}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bottom-0 w-3 h-3 bg-gray-300 hover:bg-primary"
        id={`${id}-source`}
      />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';

export default ServiceNode;
