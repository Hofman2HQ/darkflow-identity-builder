
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, ScanFace, 
  CheckSquare, FileUp, Download, Save, Trash2, GitBranch,
  ChevronDown, PlusCircle, Package
} from 'lucide-react';
import type { ServiceType } from './ServiceNode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group services by category
  const serviceCategories = {
    entry: [
      { type: 'WebApp', icon: <AppWindow />, label: 'WebApp' }
    ],
    verification: [
      { type: 'IDV', icon: <Shield />, label: 'IDV' },
      { type: 'Media', icon: <Camera />, label: 'Media' },
      { type: 'PII', icon: <User />, label: 'PII' },
      { type: 'AML', icon: <Shield />, label: 'AML' },
      { type: 'KYB', icon: <Briefcase />, label: 'KYB' }
    ],
    document: [
      { type: 'POA', icon: <FileText />, label: 'POA' },
      { type: 'AnyDoc', icon: <FileText />, label: 'AnyDoc' }
    ],
    biometric: [
      { type: 'AgeEstimation', icon: <Cake />, label: 'Age' },
      { type: 'Liveness', icon: <Scan />, label: 'Liveness' },
      { type: 'FaceCompare', icon: <ScanFace />, label: 'Face Compare' },
      { type: 'OBI', icon: <CheckSquare />, label: 'OBI' }
    ],
    utility: [
      { type: 'ConditionalLogic', icon: <GitBranch />, label: 'Conditional Logic' },
      { type: 'TextNode', icon: <FileText />, label: 'Text Note' }
    ]
  };
  
  // Get services based on selected category
  const getDisplayedServices = () => {
    if (selectedCategory === 'all') {
      return Object.values(serviceCategories).flat();
    }
    return serviceCategories[selectedCategory as keyof typeof serviceCategories] || [];
  };

  return (
    <div className="glass-morphism fixed right-4 top-4 flex flex-col gap-4 rounded-lg p-4 w-[280px] z-10 bg-background/95 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Workflow Builder</h3>
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
      
      <div className="flex justify-between mb-2">
        <h4 className="text-sm font-medium">Add Services</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              {selectedCategory === 'all' ? 'All Services' : selectedCategory}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
              All Services
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedCategory('entry')}>Entry Points</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory('verification')}>Verification</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory('document')}>Documents</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory('biometric')}>Biometrics</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory('utility')}>Utilities</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {getDisplayedServices().map((service) => (
          <ServiceButton 
            key={service.type}
            icon={service.icon} 
            label={service.label} 
            onClick={() => onAddNode(service.type as ServiceType)} 
          />
        ))}
      </div>
      
      <Separator />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-start gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Service</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px]">
          <DropdownMenuLabel>Entry Points</DropdownMenuLabel>
          {serviceCategories.entry.map(service => (
            <DropdownMenuItem 
              key={service.type}
              onClick={() => onAddNode(service.type as ServiceType)}
              className="flex items-center gap-2"
            >
              {service.icon}
              {service.label}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Verification</DropdownMenuLabel>
          {serviceCategories.verification.map(service => (
            <DropdownMenuItem 
              key={service.type}
              onClick={() => onAddNode(service.type as ServiceType)}
              className="flex items-center gap-2"
            >
              {service.icon}
              {service.label}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Logic & Utilities</DropdownMenuLabel>
          {serviceCategories.utility.map(service => (
            <DropdownMenuItem 
              key={service.type}
              onClick={() => onAddNode(service.type as ServiceType)}
              className="flex items-center gap-2"
            >
              {service.icon}
              {service.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
