import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Textarea, Select, SelectItem } from '../ui';

const AddForm = ({ currentForm, setCurrentForm, templates, setCurrentView, handleNextToBuilder }) => (
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
          <Label htmlFor="form-name">Form Name</Label>
          <Input
            id="form-name"
            placeholder="Enter form name"
            value={currentForm.name}
            onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
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
          <Label htmlFor="template">Template Selection</Label>
          <Select value={currentForm.template} onValueChange={(value) => setCurrentForm(prev => ({ ...prev, template: value }))}>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
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

export default AddForm; 
