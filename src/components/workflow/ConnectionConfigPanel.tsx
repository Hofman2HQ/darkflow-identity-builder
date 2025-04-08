
import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Edge } from '@xyflow/react';

interface ConnectionConfigPanelProps {
  edge: Edge | null;
  onClose: () => void;
  onUpdate: (edgeId: string, data: any) => void;
  onDelete: (edgeId: string) => void;
  theme?: 'light' | 'dark';
}

const ConnectionConfigPanel: React.FC<ConnectionConfigPanelProps> = ({ 
  edge, 
  onClose, 
  onUpdate,
  onDelete,
  theme = 'light' 
}) => {
  const [config, setConfig] = useState<any>(edge?.data || {});

  if (!edge) {
    return null;
  }

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(edge.id, newConfig);
  };

  const handleDelete = () => {
    if (edge && window.confirm('Are you sure you want to delete this connection?')) {
      onDelete(edge.id);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`glass-morphism fixed left-4 bottom-4 w-[300px] rounded-lg p-4 animate-fade-in z-10 ${
      isDark ? 'bg-gray-800/90 border-gray-700/50 text-white' : 'bg-white/90 border-slate-200/50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Connection Configuration</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className={`my-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      
      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="label" className={isDark ? 'text-gray-200' : ''}>Connection Label</Label>
          <Input 
            id="label" 
            value={config.label || ''} 
            onChange={(e) => handleChange('label', e.target.value)}
            className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            placeholder="e.g., On Match, If Failed"
          />
        </div>
        
        <div>
          <Label htmlFor="condition" className={isDark ? 'text-gray-200' : ''}>Condition Type</Label>
          <Select 
            value={config.conditionType || 'match'} 
            onValueChange={(value) => handleChange('conditionType', value)}
          >
            <SelectTrigger className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
              <SelectValue placeholder="Select condition type" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <SelectItem value="match">Match / Success</SelectItem>
              <SelectItem value="nomatch">No Match / Failure</SelectItem>
              <SelectItem value="always">Always</SelectItem>
              <SelectItem value="custom">Custom Logic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {config.conditionType === 'custom' && (
          <div>
            <Label htmlFor="customLogic" className={isDark ? 'text-gray-200' : ''}>Custom Logic</Label>
            <Textarea 
              id="customLogic" 
              value={config.customLogic || ''} 
              onChange={(e) => handleChange('customLogic', e.target.value)}
              className={`min-h-[80px] mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              placeholder="if (result.score > 0.8) { return true; }"
            />
          </div>
        )}
        
        <div className="flex justify-end pt-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionConfigPanel;
