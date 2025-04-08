
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, FaceId, 
  CheckSquare, XSquare
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
  | 'TextNode';

interface ServiceNodeProps {
  id: string;
  data: {
    type: ServiceType;
    label: string;
    config?: Record<string, any>;
    isValid?: boolean;
    isEntry?: boolean;
  };
  selected: boolean;
}

const getServiceIcon = (type: ServiceType) => {
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
    case 'FaceCompare': return <FaceId className="text-cyan-400" />;
    case 'OBI': return <CheckSquare className="text-emerald-400" />;
    case 'TextNode': return <FileText className="text-gray-400" />;
    default: return <XSquare className="text-gray-400" />;
  }
}

const ServiceNode = memo(({ id, data, selected }: ServiceNodeProps) => {
  const { type, label, isValid = true, isEntry = false } = data;
  
  return (
    <div
      className={cn(
        'service-node',
        !isValid && 'invalid',
        isValid && !isEntry && 'valid',
        selected && 'ring-2 ring-primary/50'
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
        {getServiceIcon(type)}
      </div>
      
      <div className="service-node__title">{label}</div>
      
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
