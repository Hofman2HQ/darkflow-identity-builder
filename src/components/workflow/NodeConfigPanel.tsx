
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { Node } from '@xyflow/react';
import type { ServiceType, LogicType } from './ServiceNode';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onClose, onUpdate }) => {
  const [config, setConfig] = useState<Record<string, any>>(node?.data?.config || {});

  if (!node) {
    return null;
  }

  const type = node.data.type as ServiceType;
  const label = node.data.label as string;

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(node.id, { config: newConfig });
  };

  const handleLogicTypeChange = (value: LogicType) => {
    onUpdate(node.id, { logicType: value });
  };

  const renderConfigFields = () => {
    switch (type) {
      case 'WebApp':
        return (
          <>
            <div>
              <Label htmlFor="appId">App ID</Label>
              <Input 
                id="appId" 
                value={config.appId || ''} 
                onChange={(e) => handleChange('appId', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="flowName">Flow Name</Label>
              <Input 
                id="flowName" 
                value={config.flowName || ''} 
                onChange={(e) => handleChange('flowName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="startPoint">Start Point</Label>
              <Select 
                value={config.startPoint || ''} 
                onValueChange={(value: string) => handleChange('startPoint', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select start point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="userRegistration">User Registration</SelectItem>
                  <SelectItem value="loginFlow">Login Flow</SelectItem>
                  <SelectItem value="verification">Verification Process</SelectItem>
                  <SelectItem value="custom">Custom Entry Point</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'IDV':
        return (
          <>
            <div>
              <Label htmlFor="countries">Countries</Label>
              <Select 
                value={config.country || ''} 
                onValueChange={(value: string) => handleChange('country', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="threshold">Match Threshold (%)</Label>
              <Input 
                id="threshold" 
                type="number" 
                min="1" 
                max="100"
                value={config.threshold || 80} 
                onChange={(e) => handleChange('threshold', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireFace">Require Face Match</Label>
              <Switch 
                id="requireFace" 
                checked={config.requireFace || false}
                onCheckedChange={(checked) => handleChange('requireFace', checked)}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="endPoint">End Point</Label>
              <Select 
                value={config.endPoint || ''} 
                onValueChange={(value: string) => handleChange('endPoint', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select end point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approval</SelectItem>
                  <SelectItem value="rejected">Rejection</SelectItem>
                  <SelectItem value="review">Manual Review</SelectItem>
                  <SelectItem value="redirect">Redirect User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'Media':
        return (
          <>
            <div>
              <Label htmlFor="mediaTypes">Required Media Types</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="selfie" 
                    checked={config.selfie || false}
                    onCheckedChange={(checked) => handleChange('selfie', checked)}
                  />
                  <Label htmlFor="selfie">Selfie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="document" 
                    checked={config.document || false}
                    onCheckedChange={(checked) => handleChange('document', checked)}
                  />
                  <Label htmlFor="document">Document</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="video" 
                    checked={config.video || false}
                    onCheckedChange={(checked) => handleChange('video', checked)}
                  />
                  <Label htmlFor="video">Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="other" 
                    checked={config.other || false}
                    onCheckedChange={(checked) => handleChange('other', checked)}
                  />
                  <Label htmlFor="other">Other</Label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select 
                value={config.serviceType || ''} 
                onValueChange={(value: string) => handleChange('serviceType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Processing</SelectItem>
                  <SelectItem value="premium">Premium (Priority)</SelectItem>
                  <SelectItem value="batch">Batch Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'TextNode':
        return (
          <>
            <div>
              <Label htmlFor="noteText">Note Text</Label>
              <Textarea 
                id="noteText" 
                value={config.noteText || ''} 
                onChange={(e) => handleChange('noteText', e.target.value)}
                className="min-h-[100px] mt-1"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="noteType">Note Type</Label>
              <Select 
                value={config.noteType || ''} 
                onValueChange={(value: string) => handleChange('noteType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="debug">Debug Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'ConditionalLogic':
        return (
          <>
            <div>
              <Label htmlFor="logicType">Logic Type</Label>
              <Select 
                value={node.data.logicType as string || "Success"} 
                onValueChange={(value: string) => handleLogicTypeChange(value as LogicType)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select logic type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Conditional">Conditional (if/else)</SelectItem>
                  <SelectItem value="Indecisive">Indecisive</SelectItem>
                  <SelectItem value="Custom">Custom/Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {node.data.logicType === "Conditional" && (
              <div className="mt-4">
                <Label htmlFor="condition">Condition</Label>
                <Input 
                  id="condition" 
                  value={config.condition || ''} 
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="mt-1"
                  placeholder="e.g., IDV country == 'US'"
                />
                <div className="mt-4">
                  <Label htmlFor="conditionType">Condition Type</Label>
                  <Select 
                    value={config.conditionType || ''} 
                    onValueChange={(value: string) => handleChange('conditionType', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greaterThan">Greater Than</SelectItem>
                      <SelectItem value="lessThan">Less Than</SelectItem>
                      <SelectItem value="regex">Regex Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {node.data.logicType === "Custom" && (
              <div className="mt-4">
                <Label htmlFor="customLogic">Custom Logic</Label>
                <Textarea 
                  id="customLogic" 
                  value={config.customLogic || ''} 
                  onChange={(e) => handleChange('customLogic', e.target.value)}
                  className="min-h-[100px] mt-1"
                  placeholder="Define your custom logic here..."
                />
              </div>
            )}
            <div className="mt-4">
              <Label htmlFor="extras">Additional Options</Label>
              <Select 
                value={config.extras || ''} 
                onValueChange={(value: string) => handleChange('extras', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select additional options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug Mode</SelectItem>
                  <SelectItem value="logging">Enable Logging</SelectItem>
                  <SelectItem value="notification">Send Notifications</SelectItem>
                  <SelectItem value="retry">Auto Retry On Failure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
        
      default:
        return (
          <>
            <div className="text-sm text-muted-foreground">
              No specific configuration available for this service type.
            </div>
            <div className="mt-4">
              <Label htmlFor="serviceOptions">Service Options</Label>
              <Select 
                value={config.serviceOptions || ''} 
                onValueChange={(value: string) => handleChange('serviceOptions', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
    }
  };

  return (
    <div className="glass-morphism fixed right-4 bottom-4 w-[300px] rounded-lg p-4 animate-fade-in z-10 bg-background/95 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{label} Configuration</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="my-2" />
      
      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="nodeName">Node Name</Label>
          <Input 
            id="nodeName" 
            value={node.data.label as string} 
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            className="mt-1"
          />
        </div>
        
        {renderConfigFields()}
      </div>
    </div>
  );
};

export default NodeConfigPanel;
