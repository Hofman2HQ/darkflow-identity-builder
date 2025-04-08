
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { LogicType } from './ServiceNode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Theme } from './ThemeProvider';

interface NodeConfigPanelProps {
  node: Node;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
  theme: Theme;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onClose, onUpdate, theme = 'light' }) => {
  const { id, data } = node;
  const [config, setConfig] = useState(data.config || {});
  const [label, setLabel] = useState(data.label || '');
  const [logicType, setLogicType] = useState<LogicType | undefined>(data.logicType);
  const [description, setDescription] = useState(data.description || '');

  useEffect(() => {
    setConfig(data.config || {});
    setLabel(data.label || '');
    setLogicType(data.logicType);
    setDescription(data.description || '');
  }, [data]);

  const handleSave = () => {
    onUpdate(id, { 
      label, 
      config,
      ...(data.type === 'ConditionalLogic' && { logicType }),
      ...(data.type === 'DescriptionBox' && { description })
    });
    onClose();
  };

  const isSpecialNode = data.type === 'StartNode' || data.type === 'EndNode';

  return (
    <div 
      className={`glass-morphism fixed bottom-4 left-4 rounded-xl p-5 w-[350px] z-20 
        ${theme === 'dark' ? 'bg-gray-800/95 border-gray-700/50 text-white' : 'bg-background/95 border-slate-200/50'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Configure Node</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="node-type">Node Type</Label>
          <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 text-sm mt-1">
            {data.type}
          </div>
        </div>
        
        {!isSpecialNode && (
          <div>
            <Label htmlFor="node-label">Display Label</Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Node Label"
              className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>
        )}
        
        {/* Special node panels */}
        {data.type === 'DescriptionBox' && (
          <div>
            <Label htmlFor="description-text">Description Text</Label>
            <Textarea
              id="description-text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description text..."
              className={`min-h-[100px] mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
            />
          </div>
        )}
        
        {/* Conditional Logic type selector */}
        {data.type === 'ConditionalLogic' && (
          <div>
            <Label htmlFor="logic-type">Logic Type</Label>
            <Select value={logicType} onValueChange={(value) => setLogicType(value as LogicType)}>
              <SelectTrigger id="logic-type" className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                <SelectValue placeholder="Select logic type" />
              </SelectTrigger>
              <SelectContent className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Conditional">Conditional</SelectItem>
                <SelectItem value="Indecisive">Indecisive</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Only show configuration panel for regular service nodes */}
        {!isSpecialNode && data.type !== 'DescriptionBox' && data.type !== 'TextNode' && (
          <>
            <Separator className={theme === 'dark' ? 'bg-gray-700' : ''} />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Configuration</h4>
              
              {/* Web App specific config */}
              {data.type === 'WebApp' && (
                <>
                  <div className="mb-3">
                    <Label htmlFor="app-id">App ID</Label>
                    <Input
                      id="app-id"
                      value={config.appId || ''}
                      onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                      placeholder="App ID"
                      className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="flow-name">Flow Name</Label>
                    <Input
                      id="flow-name"
                      value={config.flowName || ''}
                      onChange={(e) => setConfig({ ...config, flowName: e.target.value })}
                      placeholder="Flow Name"
                      className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="debug-mode"
                      checked={!!config.debugMode}
                      onCheckedChange={(value) => setConfig({ ...config, debugMode: value })}
                    />
                    <Label htmlFor="debug-mode">Enable Debug Mode</Label>
                  </div>
                </>
              )}
              
              {/* IDV specific config */}
              {data.type === 'IDV' && (
                <>
                  <div className="mb-3">
                    <Label htmlFor="id-types">ID Types (comma separated)</Label>
                    <Input
                      id="id-types"
                      value={config.idTypes || ''}
                      onChange={(e) => setConfig({ ...config, idTypes: e.target.value })}
                      placeholder="passport,driving_license"
                      className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="selfie"
                      checked={!!config.requireSelfie}
                      onCheckedChange={(value) => setConfig({ ...config, requireSelfie: value })}
                    />
                    <Label htmlFor="selfie">Require Selfie</Label>
                  </div>
                </>
              )}
              
              {/* Generic config options for all service nodes */}
              <div className="mb-3">
                <Label htmlFor="extra-notes">Notes</Label>
                <Textarea
                  id="extra-notes"
                  value={config.extraNotes || ''}
                  onChange={(e) => setConfig({ ...config, extraNotes: e.target.value })}
                  placeholder="Additional notes or context"
                  className={`min-h-[60px] mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.timeout || ''}
                  onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                  min="0"
                  className={`mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                />
              </div>
            </div>
          </>
        )}

        {(isSpecialNode || data.type === 'StartNode') && (
          <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            This is a special node with limited configuration options.
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
