
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AppWindow, Shield, Camera, User, Briefcase, 
  FileText, Cake, Scan, ScanFace, 
  CheckSquare, FileUp, Download, Save, Trash2, GitBranch,
  PlusCircle, Package, Sparkles, Workflow, Zap, Type
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Theme } from './ThemeProvider';

interface ControlPanelProps {
  onAddNode: (type: ServiceType) => void;
  onClear: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  theme: Theme;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onClear,
  onSave,
  onImport,
  onExport,
  theme = 'light'
}) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [freeText, setFreeText] = useState('');

  // Group services by category
  const serviceCategories = {
    entry: [
      { type: 'WebApp', icon: <AppWindow className="text-blue-400" />, label: 'Web Application' }
    ],
    verification: [
      { type: 'IDV', icon: <Shield className="text-green-400" />, label: 'ID Verification' },
      { type: 'Media', icon: <Camera className="text-purple-400" />, label: 'Media Upload' },
      { type: 'PII', icon: <User className="text-pink-400" />, label: 'Personal Info' },
      { type: 'AML', icon: <Shield className="text-red-400" />, label: 'AML Check' },
      { type: 'KYB', icon: <Briefcase className="text-orange-400" />, label: 'Business Verification' }
    ],
    document: [
      { type: 'POA', icon: <FileText className="text-yellow-400" />, label: 'Proof of Address' },
      { type: 'AnyDoc', icon: <FileText className="text-blue-400" />, label: 'Document Upload' }
    ],
    biometric: [
      { type: 'AgeEstimation', icon: <Cake className="text-teal-400" />, label: 'Age Estimation' },
      { type: 'Liveness', icon: <Scan className="text-indigo-400" />, label: 'Liveness Check' },
      { type: 'FaceCompare', icon: <ScanFace className="text-cyan-400" />, label: 'Face Comparison' },
      { type: 'OBI', icon: <CheckSquare className="text-emerald-400" />, label: 'Online Banking' }
    ],
    utility: [
      { type: 'ConditionalLogic', icon: <GitBranch className="text-amber-400" />, label: 'Conditional Logic' },
      { type: 'TextNode', icon: <Type className="text-slate-400" />, label: 'Text Note' }
    ]
  };

  const isDark = theme === 'dark';

  const handleAddFreeText = () => {
    if (freeText.trim()) {
      // Add a TextNode with the free text content
      onAddNode('TextNode');
      setFreeText('');
      setShowOptionsDropdown(false);
    }
  };

  return (
    <div className={`glass-morphism fixed right-4 top-4 flex flex-col gap-3 rounded-xl p-4 w-[280px] z-10 ${isDark ? 'bg-gray-800/95 border-gray-700/50 text-white' : 'bg-background/95 border-slate-200/50'} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Workflow Builder</h3>
        </div>
        
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={onSave} title="Save" className={`h-7 w-7 hover:bg-primary/10 hover:text-primary ${isDark ? 'text-gray-200' : ''}`}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onImport} title="Import" className={`h-7 w-7 hover:bg-primary/10 hover:text-primary ${isDark ? 'text-gray-200' : ''}`}>
            <FileUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onExport} title="Export" className={`h-7 w-7 hover:bg-primary/10 hover:text-primary ${isDark ? 'text-gray-200' : ''}`}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClear} title="Clear" className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator className={`my-1 ${isDark ? 'bg-gray-700' : ''}`} />
      
      <div className="space-y-3">
        {/* Add Service Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start gap-2 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90">
              <PlusCircle className="h-4 w-4" />
              <span>Add Service</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`w-[220px] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
            <DropdownMenuLabel className="flex items-center gap-2">
              <AppWindow className="h-4 w-4 text-blue-500" />
              Entry Points
            </DropdownMenuLabel>
            {serviceCategories.entry.map(service => (
              <DropdownMenuItem 
                key={service.type}
                onClick={() => onAddNode(service.type as ServiceType)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.icon}
                {service.label}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : ''} />
            <DropdownMenuLabel className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Verification
            </DropdownMenuLabel>
            {serviceCategories.verification.map(service => (
              <DropdownMenuItem 
                key={service.type}
                onClick={() => onAddNode(service.type as ServiceType)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.icon}
                {service.label}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : ''} />
            <DropdownMenuLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Documents
            </DropdownMenuLabel>
            {serviceCategories.document.map(service => (
              <DropdownMenuItem 
                key={service.type}
                onClick={() => onAddNode(service.type as ServiceType)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.icon}
                {service.label}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : ''} />
            <DropdownMenuLabel className="flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-cyan-500" />
              Biometrics
            </DropdownMenuLabel>
            {serviceCategories.biometric.map(service => (
              <DropdownMenuItem 
                key={service.type}
                onClick={() => onAddNode(service.type as ServiceType)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.icon}
                {service.label}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : ''} />
            <DropdownMenuLabel className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Logic & Utilities
            </DropdownMenuLabel>
            {serviceCategories.utility.map(service => (
              <DropdownMenuItem 
                key={service.type}
                onClick={() => onAddNode(service.type as ServiceType)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {service.icon}
                {service.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className={`w-full justify-start gap-2 border-dashed ${isDark ? 'text-gray-300 hover:text-primary hover:border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}`}>
          <Sparkles className="h-4 w-4" />
          <span>Add Condition</span>
        </Button>

        {/* Add Extra Options with Dropdown */}
        <DropdownMenu open={showOptionsDropdown} onOpenChange={setShowOptionsDropdown}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`w-full justify-start gap-2 border-dashed ${isDark ? 'text-gray-300 hover:text-primary hover:border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}`}>
              <Package className="h-4 w-4" />
              <span>Add Extra Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`w-[280px] p-3 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
            <div className="space-y-3">
              <DropdownMenuLabel>Extra Options</DropdownMenuLabel>
              <div>
                <Label htmlFor="freeTextOption" className={isDark ? 'text-gray-200' : ''}>Free Text Box</Label>
                <Textarea 
                  id="freeTextOption" 
                  placeholder="Enter your text here... (Drag to canvas)"
                  className={`min-h-[80px] mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onAddNode('TextNode')}
                  className="mt-2"
                >
                  Add to Canvas
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ControlPanel;
