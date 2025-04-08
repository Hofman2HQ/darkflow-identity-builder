
import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Theme } from './ThemeProvider';

interface Condition {
  service: string;
  component: string;
  function: string;
  value: string;
}

interface ConditionPanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (conditions: Condition[]) => void;
  theme: Theme;
}

const ConditionPanel: React.FC<ConditionPanelProps> = ({
  open,
  onClose,
  onSubmit,
  theme
}) => {
  const [conditions, setConditions] = useState<Condition[]>([{
    service: '',
    component: '',
    function: '',
    value: ''
  }]);

  const handleAddCondition = () => {
    setConditions([...conditions, {
      service: '',
      component: '',
      function: '',
      value: ''
    }]);
  };

  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value
    };
    setConditions(updatedConditions);
  };

  const handleSubmit = () => {
    onSubmit(conditions);
    setConditions([{
      service: '',
      component: '',
      function: '',
      value: ''
    }]);
  };

  const isDark = theme === 'dark';

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        className={`w-[450px] overflow-y-auto ${isDark ? 'bg-gray-800 text-white border-gray-700' : ''}`}
        side="right"
      >
        <SheetHeader>
          <SheetTitle className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>
            Create New Rule
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="px-6 py-2 bg-primary/20 text-primary font-medium rounded-full">
              IF
            </div>
          </div>

          {conditions.map((condition, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-lg mb-4 ${isDark 
                ? 'bg-gray-700/50 backdrop-blur-sm border border-gray-600/50' 
                : 'bg-gray-50/80 backdrop-blur-sm border border-gray-200/50'}`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`service-${index}`} className={`mb-2 block ${isDark ? 'text-gray-200' : ''}`}>
                    Service
                  </Label>
                  <Select 
                    value={condition.service} 
                    onValueChange={(value) => updateCondition(index, 'service', value)}
                  >
                    <SelectTrigger 
                      id={`service-${index}`}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    >
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="idv">ID Verification</SelectItem>
                      <SelectItem value="media">Media Upload</SelectItem>
                      <SelectItem value="pii">Personal Info</SelectItem>
                      <SelectItem value="aml">AML Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`component-${index}`} className={`mb-2 block ${isDark ? 'text-gray-200' : ''}`}>
                    Component
                  </Label>
                  <Select 
                    value={condition.component} 
                    onValueChange={(value) => updateCondition(index, 'component', value)}
                  >
                    <SelectTrigger 
                      id={`component-${index}`}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    >
                      <SelectValue placeholder="Component" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="face">Face Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`function-${index}`} className={`mb-2 block ${isDark ? 'text-gray-200' : ''}`}>
                    Function
                  </Label>
                  <Select 
                    value={condition.function} 
                    onValueChange={(value) => updateCondition(index, 'function', value)}
                  >
                    <SelectTrigger 
                      id={`function-${index}`}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    >
                      <SelectValue placeholder="Function" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greaterThan">Greater Than</SelectItem>
                      <SelectItem value="lessThan">Less Than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`value-${index}`} className={`mb-2 block ${isDark ? 'text-gray-200' : ''}`}>
                    Value
                  </Label>
                  <Input
                    id={`value-${index}`}
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    placeholder="Value"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button 
            variant="outline" 
            onClick={handleAddCondition} 
            className={`w-full justify-center gap-2 mt-2 ${isDark 
              ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 text-white' 
              : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/50'}`}
          >
            <Plus className="h-4 w-4" />
            Add Condition
          </Button>

          <div className="mt-8 flex justify-end">
            <SheetClose asChild>
              <Button 
                variant="outline" 
                onClick={onClose}
                className={`mr-2 ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
              >
                Cancel
              </Button>
            </SheetClose>
            <Button 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              <Check className="h-4 w-4 mr-2" /> Submit
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConditionPanel;
