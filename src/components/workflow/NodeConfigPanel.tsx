
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
import type { ServiceType } from './ServiceNode';

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onClose, onUpdate }) => {
  const [config, setConfig] = useState<any>(node?.data?.config || {});

  if (!node) {
    return null;
  }

  const type: ServiceType = node.data.type;
  const label = node.data.label;

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(node.id, { config: newConfig });
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
          </>
        );
      
      case 'IDV':
        return (
          <>
            <div>
              <Label htmlFor="countries">Countries</Label>
              <Select 
                value={config.country || ''} 
                onValueChange={(value) => handleChange('country', value)}
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
          </>
        );
        
      // Add configurations for other service types
      
      default:
        return (
          <div className="text-sm text-muted-foreground">
            No specific configuration available for this service type.
          </div>
        );
    }
  };

  return (
    <div className="glass-morphism fixed right-4 bottom-4 w-[300px] rounded-lg p-4 animate-fade-in z-10">
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
            value={node.data.label} 
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
