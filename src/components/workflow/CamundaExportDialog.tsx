
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { transformToCamunda, validateCamundaWorkflow } from '@/utils/camundaExporter';
import type { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CamundaExportDialogProps {
  open: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  theme: 'light' | 'dark';
}

const CamundaExportDialog: React.FC<CamundaExportDialogProps> = ({
  open,
  onClose,
  nodes,
  edges,
  theme
}) => {
  const [copied, setCopied] = useState(false);
  const [exportErrors, setExportErrors] = useState<string[]>([]);
  
  // Reset errors when nodes or edges change or when dialog opens
  useEffect(() => {
    if (open) {
      validateWorkflow();
    }
  }, [open, nodes, edges]);
  
  const validateWorkflow = () => {
    try {
      // Transform the workflow
      const camundaWorkflow = transformToCamunda(nodes, edges);
      
      // Validate the workflow
      const errors = validateCamundaWorkflow(camundaWorkflow);
      
      setExportErrors(errors);
      return errors.length === 0;
    } catch (error) {
      console.error('Export validation error:', error);
      setExportErrors([error instanceof Error ? error.message : 'Unknown error during export']);
      return false;
    }
  };
  
  const handleExport = () => {
    try {
      // Transform the workflow
      const camundaWorkflow = transformToCamunda(nodes, edges);
      
      // Copy to clipboard
      navigator.clipboard.writeText(JSON.stringify(camundaWorkflow, null, 2));
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Your Camunda workflow has been copied to the clipboard.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportErrors([error instanceof Error ? error.message : 'Unknown error during export']);
    }
  };
  
  const downloadWorkflow = () => {
    try {
      // Transform the workflow
      const camundaWorkflow = transformToCamunda(nodes, edges);
      
      // Create a download link
      const jsonString = JSON.stringify(camundaWorkflow, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
      
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', 'camunda-workflow.json');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Workflow Downloaded",
        description: "Your Camunda workflow has been downloaded as JSON.",
      });
    } catch (error) {
      console.error('Download error:', error);
      setExportErrors([error instanceof Error ? error.message : 'Unknown error during export']);
    }
  };
  
  const clearErrors = () => {
    validateWorkflow();
  };
  
  const isDark = theme === 'dark';
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-3xl ${isDark ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isDark ? 'text-white' : ''}>Export to Camunda Format</DialogTitle>
          <DialogDescription className={isDark ? 'text-gray-300' : ''}>
            Transform your workflow into a Camunda-compatible JSON format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {exportErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Failed</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {exportErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className={`p-4 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <pre className={`whitespace-pre-wrap overflow-auto max-h-[400px] text-sm ${isDark ? 'text-gray-200' : ''}`}>
              {exportErrors.length === 0 ? (
                JSON.stringify(transformToCamunda(nodes, edges), null, 2)
              ) : (
                "Please fix the validation errors to see the JSON output."
              )}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          {exportErrors.length > 0 ? (
            <Button 
              variant="default" 
              onClick={clearErrors}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Fix Errors
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className={`flex items-center gap-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''}`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
              
              <Button 
                variant="default"
                onClick={downloadWorkflow}
              >
                Download JSON
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CamundaExportDialog;
