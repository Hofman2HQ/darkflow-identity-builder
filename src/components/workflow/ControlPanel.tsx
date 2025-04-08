
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, ScanFace, 
  CheckSquare, FileUp, Download, Save, Trash2, GitBranch
} from 'lucide-react';
import type { ServiceType } from './ServiceNode';

interface ControlPanelProps {
  onAddNode: (type: ServiceType) => void;
  onClear: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onClear,
  onSave,
  onImport,
  onExport
}) => {
  return (
    <div className="glass-morphism fixed right-4 top-4 flex flex-col gap-4 rounded-lg p-4 w-[250px] z-10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Services</h3>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={onSave} title="Save" className="h-7 w-7">
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onImport} title="Import" className="h-7 w-7">
            <FileUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onExport} title="Export" className="h-7 w-7">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClear} title="Clear" className="h-7 w-7">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-2">
        <ServiceButton icon={<AppWindow />} label="WebApp" onClick={() => onAddNode('WebApp')} />
        <ServiceButton icon={<Shield />} label="IDV" onClick={() => onAddNode('IDV')} />
        <ServiceButton icon={<Camera />} label="Media" onClick={() => onAddNode('Media')} />
        <ServiceButton icon={<User />} label="PII" onClick={() => onAddNode('PII')} />
        <ServiceButton icon={<Shield />} label="AML" onClick={() => onAddNode('AML')} />
        <ServiceButton icon={<Briefcase />} label="KYB" onClick={() => onAddNode('KYB')} />
        <ServiceButton icon={<FileText />} label="POA" onClick={() => onAddNode('POA')} />
        <ServiceButton icon={<FileText />} label="AnyDoc" onClick={() => onAddNode('AnyDoc')} />
        <ServiceButton icon={<Cake />} label="Age" onClick={() => onAddNode('AgeEstimation')} />
        <ServiceButton icon={<Scan />} label="Liveness" onClick={() => onAddNode('Liveness')} />
        <ServiceButton icon={<ScanFace />} label="Face" onClick={() => onAddNode('FaceCompare')} />
        <ServiceButton icon={<CheckSquare />} label="OBI" onClick={() => onAddNode('OBI')} />
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <ServiceButton 
          icon={<GitBranch />} 
          label="Conditional Logic" 
          onClick={() => onAddNode('ConditionalLogic')} 
          fullWidth 
        />
        <ServiceButton 
          icon={<FileText />} 
          label="Text Note" 
          onClick={() => onAddNode('TextNode')} 
          fullWidth 
        />
      </div>
    </div>
  );
};

interface ServiceButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ icon, label, onClick, fullWidth }) => (
  <Button
    variant="secondary"
    size="sm"
    className={`flex items-center justify-start gap-2 h-9 ${fullWidth ? 'col-span-2' : ''}`}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

export default ControlPanel;
