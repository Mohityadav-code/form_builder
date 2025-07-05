import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Textarea, Select, SelectItem } from '../ui';
import { getFormById } from '../api';

const AddForm = ({ currentForm, setCurrentForm, templates, setCurrentView, handleNextToBuilder }) => {
  // Find the selected template's name for display
  let selectedTemplateLabel = 'Select...';
  if (currentForm.template === 'blank') {
    selectedTemplateLabel = 'Blank Form';
  } else if (currentForm.template) {
    const selected = templates.find(t => String(t.id) === String(currentForm.template));
    if (selected) selectedTemplateLabel = selected.name;
  }

  useEffect(() => {
    async function preloadTemplate() {
      if (currentForm.template && currentForm.template !== 'blank') {
        const selected = templates.find(t => String(t.id) === String(currentForm.template));
        if (selected) {
          try {
            const details = await getFormById(selected.id);
            setCurrentForm(prev => ({
              ...prev,
              fields: details.fields || [],
              // Only update description if user hasn't entered one yet
              description: prev.description || details.description || '',
            }));
          } catch {
            console.error('Failed to preload template:', selected.id);
            setCurrentForm(prev => ({ ...prev, fields: [] }));
          }
        }
      } else if (currentForm.template === 'blank') {
        // For blank template, just clear fields but keep description
        setCurrentForm(prev => ({ ...prev, fields: [] }));
      }
    }
    preloadTemplate();
    // eslint-disable-next-line
  }, [currentForm.template]);

  // Set blank as default template if none is selected
  useEffect(() => {
    if (!currentForm.template) {
      setCurrentForm(prev => ({ ...prev, template: 'blank' }));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>Enter the basic information for your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="form-name">
              Form Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="form-name"
              placeholder="Enter form name"
              value={currentForm.name}
              onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              placeholder="Enter form description"
              value={currentForm.description}
              onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Template Selection <span className="text-red-500">*</span></Label>
            <Select value={selectedTemplateLabel || ''} onValueChange={(value) => setCurrentForm(prev => ({ ...prev, template: value }))}>
              <SelectItem key="blank" value="blank">
                <div>
                  <div className="font-medium">Blank Form</div>
                  <div className="text-sm text-gray-600">Start with empty form</div>
                </div>
              </SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </Select>
            <div className="mt-1 text-sm text-gray-700 font-medium">Selected: {selectedTemplateLabel}</div>
          </div>
          {/* Show preloaded fields if any (for preview) */}
          {currentForm.fields && currentForm.fields.length > 0 && (
            <div className="bg-gray-100 rounded p-4 mt-4">
              <div className="font-semibold mb-2">Preloaded Fields:</div>
              <ul className="list-disc pl-5">
                {currentForm.fields.map((f, idx) => (
                  <li key={idx}>{f.label} ({f.type})</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
              Cancel
            </Button>
            <Button 
              onClick={handleNextToBuilder}
              disabled={!currentForm.name || !currentForm.template}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddForm; 
