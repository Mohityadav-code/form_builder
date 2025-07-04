import React, { useEffect } from 'react';
import { ArrowLeft, FileText, Sparkles, Eye } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Textarea, Select, SelectItem } from '../ui';
import { getFormById } from '../api';

const AddForm = ({ currentForm, setCurrentForm, templates, setCurrentView, handleNextToBuilder }) => {
  // Find the selected template's name for display
  let selectedTemplateLabel = 'Select...';
  if (currentForm.template === 'blank' || !currentForm.template) {
    selectedTemplateLabel = 'Blank Form';
  } else {
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
              description: details.description || '',
              fields: details.fields || [],
            }));
          } catch {
            console.error('Failed to preload template:', selected.id);
            setCurrentForm(prev => ({ ...prev, description: '', fields: [] }));
          }
        }
      } else if (currentForm.template === 'blank') {
        setCurrentForm(prev => ({ ...prev, description: '', fields: [] }));
      }
    }
    preloadTemplate();
    // eslint-disable-next-line
  }, [currentForm.template]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('dashboard')}
            className="hover:bg-white hover:shadow-sm transition-all duration-200 border-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Create New Form
            </h1>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Form Details
            </CardTitle>
            <CardDescription className="text-blue-100">
              Enter the basic information for your form and choose a template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Form Name */}
            <div className="space-y-3">
              <Label htmlFor="form-name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Form Name
              </Label>
              <Input
                id="form-name"
                placeholder="Enter a descriptive name for your form"
                value={currentForm.name}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 text-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70"
              />
            </div>

            {/* Form Description */}
            <div className="space-y-3">
              <Label htmlFor="form-description" className="text-sm font-semibold text-slate-700">
                Form Description
              </Label>
              <Textarea
                id="form-description"
                placeholder="Provide a brief description of what this form is for..."
                value={currentForm.description}
                onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-24 resize-none border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70"
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-3">
              <Label htmlFor="template" className="text-sm font-semibold text-slate-700">
                Template Selection
              </Label>
              <Select 
                value={selectedTemplateLabel || ''} 
                onValueChange={(value) => setCurrentForm(prev => ({ ...prev, template: value }))}
                className="bg-white/70"
              >
                <SelectItem key="blank" value="blank">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Blank Form</div>
                      <div className="text-sm text-slate-500">Start with an empty form</div>
                    </div>
                  </div>
                </SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-3 py-2">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{template.name}</div>
                        <div className="text-sm text-slate-500">{template.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
              
              {/* Selected Template Display */}
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800">
                  Selected Template: <span className="text-blue-900">{selectedTemplateLabel}</span>
                </div>
              </div>
            </div>

            {/* Preloaded Fields Preview */}
            {currentForm.fields && currentForm.fields.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-emerald-600" />
                  <div className="font-semibold text-emerald-800">Template Preview</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentForm.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-emerald-100">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="font-medium text-slate-700">{field.label}</span>
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {field.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-3 hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleNextToBuilder}
                disabled={!currentForm.name || !currentForm.template}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Builder
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddForm;