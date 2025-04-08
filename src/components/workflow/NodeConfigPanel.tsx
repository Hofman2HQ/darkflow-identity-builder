
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogicType } from './ServiceNode';
import type { Node } from '@xyflow/react';

// Define the structure of the config object
interface NodeConfig {
  appId?: string;
  flowName?: string;
  idTypes?: string;
  requireSelfie?: boolean;
  debugMode?: boolean;
  testFlags?: string;
  extraNotes?: string;
  timeout?: number;
  [key: string]: any; // Allow for other properties
}

// FlowNodeData is the type for the data property of a Node
interface FlowNodeData {
  type: string;
  label: string;
  config?: NodeConfig;
  isValid?: boolean;
  isEntry?: boolean;
  logicType?: LogicType;
  [key: string]: any; // Add index signature for string keys
}

interface NodeConfigPanelProps {
  node: Node<FlowNodeData> | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
  theme?: 'light' | 'dark';
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ 
  node, 
  onClose, 
  onUpdate,
  theme = 'light'
}) => {
  const [extraType, setExtraType] = useState<string>('none');
  const [freeText, setFreeText] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');

  if (!node) {
    return null;
  }

  useEffect(() => {
    if (node?.data?.config?.extraNotes) {
      setFreeText(node.data.config.extraNotes as string);
      setExtraType('freeText');
    }

    if (node?.data?.type === 'TextNode') {
      setTextContent(node.data.textContent || 'Enter your text here');
    }
  }, [node]);

  const handleChange = (key: string, value: any) => {
    onUpdate(node.id, { [key]: value });
  };

  const handleConfigChange = (key: string, value: any) => {
    const currentConfig = node.data.config || {};
    const newConfig = { ...currentConfig, [key]: value };
    onUpdate(node.id, { config: newConfig });
  };

  const handleExtraTypeChange = (value: string) => {
    setExtraType(value);
    
    // If free text is selected, update the node with the current free text value
    if (value === 'freeText') {
      handleConfigChange('extraNotes', freeText);
    }
  };

  const handleFreeTextChange = (text: string) => {
    setFreeText(text);
    handleConfigChange('extraNotes', text);
  };

  const handleTextContentChange = (text: string) => {
    setTextContent(text);
    handleChange('textContent', text);
  };
  
  const isDark = theme === 'dark';

  return (
    <div className={`glass-morphism fixed right-4 bottom-4 w-[350px] rounded-lg p-4 animate-fade-in z-10 ${
      isDark ? 'bg-gray-800/90 border-gray-700/50 text-white' : 'bg-white/90 border-slate-200/50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Node Configuration</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className={`my-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      
      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="label" className={isDark ? 'text-gray-200' : ''}>Node Label</Label>
          <Input 
            id="label" 
            value={node.data.label || ''} 
            onChange={(e) => handleChange('label', e.target.value)}
            className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            placeholder="e.g., ID Verification, Face Match"
          />
        </div>
        
        {node.data.type === 'TextNode' && (
          <div>
            <Label htmlFor="textContent" className={isDark ? 'text-gray-200' : ''}>Text Content</Label>
            <Textarea 
              id="textContent" 
              value={textContent} 
              onChange={(e) => handleTextContentChange(e.target.value)}
              className={`min-h-[100px] mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              placeholder="Enter your text here..."
            />
          </div>
        )}
        
        {node.data.type === 'ConditionalLogic' && (
          <div>
            <Label htmlFor="logicType" className={isDark ? 'text-gray-200' : ''}>Logic Type</Label>
            <Select 
              value={node.data.logicType || 'Success'} 
              onValueChange={(value) => handleChange('logicType', value as LogicType)}
            >
              <SelectTrigger className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                <SelectValue placeholder="Select logic type" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Conditional">Conditional</SelectItem>
                <SelectItem value="Indecisive">Indecisive</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {node.data.type === 'WebApp' && (
          <>
            <div>
              <Label htmlFor="appId" className={isDark ? 'text-gray-200' : ''}>Application ID</Label>
              <Input 
                id="appId" 
                value={node.data.config?.appId || ''} 
                onChange={(e) => handleConfigChange('appId', e.target.value)}
                className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="e.g., app-123456"
              />
            </div>
            <div>
              <Label htmlFor="flowName" className={isDark ? 'text-gray-200' : ''}>Flow Name</Label>
              <Input 
                id="flowName" 
                value={node.data.config?.flowName || ''} 
                onChange={(e) => handleConfigChange('flowName', e.target.value)}
                className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="e.g., ID Verification Flow"
              />
            </div>
          </>
        )}
        
        {node.data.type === 'IDV' && (
          <>
            <div>
              <Label htmlFor="idTypes" className={isDark ? 'text-gray-200' : ''}>Supported ID Types</Label>
              <Input 
                id="idTypes" 
                value={node.data.config?.idTypes || ''} 
                onChange={(e) => handleConfigChange('idTypes', e.target.value)}
                className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="e.g., passport, driving_license"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireSelfie" className={isDark ? 'text-gray-200' : ''}>Require Selfie</Label>
              <Switch 
                id="requireSelfie" 
                checked={!!node.data.config?.requireSelfie} 
                onCheckedChange={(checked) => handleConfigChange('requireSelfie', checked)}
                className={isDark ? 'data-[state=checked]:bg-indigo-400' : ''}
              />
            </div>
          </>
        )}
        
        <div>
          <Label htmlFor="extraOptions" className={isDark ? 'text-gray-200' : ''}>Extras</Label>
          <Select 
            value={extraType} 
            onValueChange={handleExtraTypeChange}
          >
            <SelectTrigger className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
              <SelectValue placeholder="Add extra options" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="debug">Debug Mode</SelectItem>
              <SelectItem value="testFlags">Test Flags</SelectItem>
              <SelectItem value="freeText">Free Text Notes</SelectItem>
              <SelectItem value="timer">Set Timer</SelectItem>
            </SelectContent>
          </Select>
          
          {extraType === 'debug' && (
            <div className="mt-2 flex items-center justify-between">
              <Label htmlFor="debugMode" className={isDark ? 'text-gray-200' : ''}>Enable Debug</Label>
              <Switch 
                id="debugMode" 
                checked={!!node.data.config?.debugMode} 
                onCheckedChange={(checked) => handleConfigChange('debugMode', checked)}
                className={isDark ? 'data-[state=checked]:bg-indigo-400' : ''}
              />
            </div>
          )}
          
          {extraType === 'testFlags' && (
            <div className="mt-2">
              <Label htmlFor="testFlags" className={isDark ? 'text-gray-200' : ''}>Test Flags</Label>
              <Input 
                id="testFlags" 
                value={node.data.config?.testFlags || ''} 
                onChange={(e) => handleConfigChange('testFlags', e.target.value)}
                className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="e.g., skip_validation=true"
              />
            </div>
          )}
          
          {extraType === 'freeText' && (
            <div className="mt-2">
              <Label htmlFor="freeTextNotes" className={isDark ? 'text-gray-200' : ''}>Notes</Label>
              <Textarea 
                id="freeTextNotes" 
                value={freeText} 
                onChange={(e) => handleFreeTextChange(e.target.value)}
                className={`min-h-[100px] mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                placeholder="Add your notes, comments, or instructions here..."
              />
            </div>
          )}
          
          {extraType === 'timer' && (
            <div className="mt-2">
              <Label htmlFor="timeout" className={isDark ? 'text-gray-200' : ''}>Timeout (seconds)</Label>
              <Input 
                id="timeout" 
                type="number"
                min={0}
                value={node.data.config?.timeout || 30} 
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
