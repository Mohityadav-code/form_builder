import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Switch } from './components/ui/switch';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Plus, Edit3, Eye, Trash2, ArrowLeft, GripVertical } from 'lucide-react';

const FormBuilder = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, add-form, form-builder
  const [forms, setForms] = useState([
    {
      id: 1,
      name: 'Contact Form',
      description: 'Basic contact form with name, email, and message',
      fields: [
        { id: 1, type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
        { id: 2, type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
        { id: 3, type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Survey Form',
      description: 'Customer satisfaction survey',
      fields: [
        { id: 1, type: 'text', label: 'Name', placeholder: 'Your name', required: true },
        { id: 2, type: 'select', label: 'Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true }
      ],
      createdAt: '2024-01-20'
    }
  ]);

  const [currentForm, setCurrentForm] = useState({
    name: '',
    description: '',
    template: '',
    fields: []
  });

  const [selectedField, setSelectedField] = useState(null);
  const [fieldConfig, setFieldConfig] = useState({
    type: 'text',
    label: '',
    placeholder: '',
    helperText: '',
    required: false,
    options: []
  });

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'textarea', label: 'Textarea', icon: '📄' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'file', label: 'File Upload', icon: '📎' }
  ];

  const templates = [
    { id: 'blank', name: 'Blank Form', description: 'Start with empty form' },
    { id: 'contact', name: 'Contact Form', description: 'Pre-built contact form' },
    { id: 'survey', name: 'Survey Form', description: 'Customer feedback survey' },
    { id: 'registration', name: 'Registration Form', description: 'User registration form' }
  ];

  const handleCreateForm = () => {
    setCurrentView('add-form');
    setCurrentForm({ name: '', description: '', template: '', fields: [] });
  };

  const handleNextToBuilder = () => {
    if (currentForm.template && currentForm.template !== 'blank') {
      const templateForm = forms.find(f => f.name.toLowerCase().includes(currentForm.template));
      if (templateForm) {
        setCurrentForm(prev => ({ ...prev, fields: [...templateForm.fields] }));
      }
    }
    setCurrentView('form-builder');
  };

  const handleAddField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      helperText: '',
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : []
    };
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFieldConfig({ ...field });
  };

  const handleFieldUpdate = () => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => 
        f.id === selectedField.id ? { ...fieldConfig } : f
      )
    }));
    setSelectedField(null);
    setFieldConfig({
      type: 'text',
      label: '',
      placeholder: '',
      helperText: '',
      required: false,
      options: []
    });
  };

  const handleSaveForm = () => {
    const newForm = {
      id: Date.now(),
      ...currentForm,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setForms(prev => [...prev, newForm]);
    setCurrentView('dashboard');
  };

  const renderFieldPreview = (field) => {
    const baseProps = {
      placeholder: field.placeholder,
      className: "w-full"
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return <Input {...baseProps} type={field.type} />;
      case 'textarea':
        return <Textarea {...baseProps} rows={3} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id={field.id} />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="radio" id={`${field.id}-${idx}`} name={field.id} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return <Input {...baseProps} type="date" />;
      case 'file':
        return <Input {...baseProps} type="file" />;
      default:
        return <Input {...baseProps} />;
    }
  };

  if (currentView === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Form Builder</h1>
            <p className="text-muted-foreground">Create and manage your forms</p>
          </div>
          <Button onClick={handleCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Form
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {form.name}
                  <Badge variant="secondary">{form.fields.length} fields</Badge>
                </CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'add-form') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Form</h1>
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
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
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
  }

  if (currentView === 'form-builder') {
    return (
      <div className="h-screen flex">
        {/* Left Sidebar - Field Types */}
        <div className="w-80 border-r bg-gray-50 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentView('add-form')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">Field Types</h2>
          </div>
          
          <div className="space-y-2">
            {fieldTypes.map((fieldType) => (
              <Button
                key={fieldType.type}
                variant="outline"
                className="w-full justify-start gap-2 h-auto p-3"
                onClick={() => handleAddField(fieldType.type)}
              >
                <span className="text-lg">{fieldType.icon}</span>
                <span>{fieldType.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Center - Form Builder */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{currentForm.name}</h1>
              <p className="text-muted-foreground">{currentForm.description}</p>
            </div>

            <div className="space-y-4">
              {currentForm.fields.map((field) => (
                <Card 
                  key={field.id} 
                  className={`cursor-pointer transition-all ${selectedField?.id === field.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                  onClick={() => handleFieldSelect(field)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Label className="font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                    {renderFieldPreview(field)}
                    {field.helperText && (
                      <p className="text-sm text-muted-foreground mt-1">{field.helperText}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {currentForm.fields.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No fields added yet. Click on field types to add them.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                Save as Draft
              </Button>
              <Button onClick={handleSaveForm} disabled={currentForm.fields.length === 0}>
                Save Form
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Field Configuration */}
        <div className="w-80 border-l bg-gray-50 p-4 space-y-4">
          <h2 className="text-lg font-semibold">Field Configuration</h2>
          
          {selectedField ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select value={fieldConfig.type} onValueChange={(value) => setFieldConfig(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={fieldConfig.label}
                  onChange={(e) => setFieldConfig(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={fieldConfig.placeholder}
                  onChange={(e) => setFieldConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Helper Text</Label>
                <Textarea
                  value={fieldConfig.helperText}
                  onChange={(e) => setFieldConfig(prev => ({ ...prev, helperText: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={fieldConfig.required}
                  onCheckedChange={(checked) => setFieldConfig(prev => ({ ...prev, required: checked }))}
                />
                <Label>Required Field</Label>
              </div>

              {(fieldConfig.type === 'select' || fieldConfig.type === 'radio') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {fieldConfig.options?.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...fieldConfig.options];
                            newOptions[idx] = e.target.value;
                            setFieldConfig(prev => ({ ...prev, options: newOptions }));
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = fieldConfig.options.filter((_, i) => i !== idx);
                            setFieldConfig(prev => ({ ...prev, options: newOptions }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFieldConfig(prev => ({
                          ...prev,
                          options: [...prev.options, `Option ${prev.options.length + 1}`]
                        }));
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button onClick={handleFieldUpdate} className="flex-1">
                  Update Field
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentForm(prev => ({
                      ...prev,
                      fields: prev.fields.filter(f => f.id !== selectedField.id)
                    }));
                    setSelectedField(null);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Select a field to configure its properties</p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default FormBuilder;
