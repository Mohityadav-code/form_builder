import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Plus, Settings, Eye, Trash2, Copy, Move, Zap, Save } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createForm, updateForm } from '../api';

// Mock UI components for demo
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick, ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} onClick={onClick} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Label = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} {...props} />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} {...props} />
);

const Switch = ({ checked, onCheckedChange, className = '' }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    } ${className}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      checked ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

const Select = ({ value, onValueChange, children, className = '' }) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
  >
    {children}
  </select>
);

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const Separator = ({ className = '' }) => (
  <div className={`h-px bg-gray-200 ${className}`} />
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Tooltip = ({ children, content }) => (
  <div className="group relative">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {content}
    </div>
  </div>
);

// Mock data
const mockFieldTypes = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'textarea', label: 'Textarea', icon: '📄' },
  { type: 'select', label: 'Select', icon: '📋' },
  { type: 'radio', label: 'Radio', icon: '🔘' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'file', label: 'File Upload', icon: '📎' }
];

const mockForm = {
  id: 1,
  name: 'Customer Feedback Form',
  description: 'Collect valuable feedback from your customers',
  fields: [
    { id: 1, type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true, helperText: 'Please provide your complete name' },
    { id: 2, type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
    { id: 3, type: 'select', label: 'Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
    { id: 4, type: 'textarea', label: 'Comments', placeholder: 'Share your feedback...', required: false, helperText: 'Optional: Tell us more about your experience' }
  ]
};

const FormBuilderView = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [fieldConfig, setFieldConfig] = useState({});
  const [currentForm, setCurrentForm] = useState(mockForm);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFieldConfig(field);
  };

  const handleAddField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(currentForm.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentForm(prev => ({
      ...prev,
      fields: items
    }));
  };

  const handleDuplicateField = (fieldId) => {
    const fieldToDuplicate = currentForm.fields.find(f => f.id === fieldId);
    if (!fieldToDuplicate) return;

    const duplicatedField = {
      ...fieldToDuplicate,
      id: Date.now(),
      label: `${fieldToDuplicate.label} (Copy)`
    };

    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, duplicatedField]
    }));
  };

  const handleDeleteField = (fieldId) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSaveForm = async () => {
    if (currentForm.fields.length === 0) {
      alert('Please add at least one field to your form before saving.');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const formData = {
        name: currentForm.name,
        description: currentForm.description,
        fields: currentForm.fields
      };

      let savedForm;
      if (currentForm.id && currentForm.id !== 1) {
        // Update existing form
        savedForm = await updateForm(currentForm.id, formData);
      } else {
        // Create new form
        savedForm = await createForm(formData);
        setCurrentForm(prev => ({ ...prev, id: savedForm.id }));
      }

      setSaveStatus({ type: 'success', message: 'Form saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to save form:', error);
      setSaveStatus({ type: 'error', message: 'Failed to save form. Please try again.' });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return <Input placeholder={field.placeholder} disabled />;
      case 'textarea':
        return <Textarea placeholder={field.placeholder} disabled rows={3} />;
      case 'select':
        return (
          <Select disabled>
            <SelectItem value="">Select an option</SelectItem>
            {field.options?.map((option, idx) => (
              <SelectItem key={idx} value={option}>{option}</SelectItem>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled />
            <label className="text-sm">Checkbox option</label>
          </div>
        );
      case 'date':
        return <Input type="date" disabled />;
      case 'file':
        return <Input type="file" disabled />;
      default:
        return <Input placeholder={field.placeholder} disabled />;
    }
  };

  const renderFormField = (field, index) => {
    if (previewMode) {
      // Preview mode - show actual form fields
      return (
        <div key={field.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="font-medium text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
          {renderFieldPreview(field)}
          {field.helperText && (
            <p className="text-sm text-gray-600 italic">{field.helperText}</p>
          )}
        </div>
      );
    }

    // Edit mode - show draggable field with controls
    return (
      <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`transition-all duration-200 ${
              snapshot.isDragging ? 'opacity-75 rotate-2' : ''
            }`}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 group ${
                selectedField?.id === field.id
                  ? 'ring-2 ring-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50'
                  : 'hover:shadow-md hover:border-blue-200'
              } ${snapshot.isDragging ? 'shadow-xl' : ''}`}
              onClick={() => handleFieldSelect(field)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div 
                    {...provided.dragHandleProps}
                    className={`flex flex-col items-center gap-1 transition-opacity cursor-move hover:opacity-100 ${
                      snapshot.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <GripVertical className={`h-4 w-4 ${
                      snapshot.isDragging ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium text-gray-900 flex items-center gap-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                        <Badge variant="default" className="text-xs">
                          {field.type}
                        </Badge>
                      </Label>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Duplicate field">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateField(field.id);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete field">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="form-field-preview">
                      {renderFieldPreview(field)}
                    </div>
                    {field.helperText && (
                      <p className="text-sm text-gray-600 italic">{field.helperText}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Sidebar - Field Types */}
      {!previewMode && (
        <div className="w-80 border-r bg-white shadow-lg">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="font-semibold">Form Builder</h2>
                <p className="text-sm text-blue-100">Drag & drop fields</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto h-full">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Field Types</h3>
              <div className="grid grid-cols-1 gap-2">
                {mockFieldTypes.map((fieldType) => (
                  <Tooltip key={fieldType.type} content={`Add ${fieldType.label}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 border border-transparent transition-all duration-200 group"
                      onClick={() => handleAddField(fieldType.type)}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{fieldType.icon}</span>
                      <span className="font-medium">{fieldType.label}</span>
                      <Plus className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Center - Form Builder */}
      <div className={`flex flex-col ${previewMode ? 'w-full' : 'flex-1'}`}>
        {/* Header */}
        <div className="bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-6 w-6 text-blue-600" />
                  {!previewMode ? (
                    <Input
                      value={currentForm.name}
                      onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold text-gray-900 border-none p-0 focus:ring-0 focus:border-none bg-transparent"
                      placeholder="Form Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{currentForm.name}</h1>
                  )}
                </div>
                {!previewMode ? (
                  <Input
                    value={currentForm.description}
                    onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="text-gray-600 text-sm border-none p-0 focus:ring-0 focus:border-none bg-transparent"
                    placeholder="Form description"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{currentForm.description}</p>
                )}
              </div>
              <Badge variant="success">
                {currentForm.fields.length} field{currentForm.fields.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button 
                size="sm" 
                disabled={currentForm.fields.length === 0 || isSaving}
                onClick={handleSaveForm}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Form'}
              </Button>
            </div>
          </div>
          
          {/* Save Status Message */}
          {saveStatus && (
            <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {saveStatus.message}
            </div>
          )}
        </div>

        {/* Form Canvas */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {currentForm.fields.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
                  <p className="text-gray-600 mb-4">Click on field types from the left panel to add them to your form</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mockFieldTypes.slice(0, 3).map((type) => (
                      <Button
                        key={type.type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddField(type.type)}
                        className="flex items-center gap-2"
                      >
                        <span>{type.icon}</span>
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              previewMode ? (
                // Preview mode - show actual form
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentForm.name}</h2>
                      <p className="text-gray-600">{currentForm.description}</p>
                    </div>
                    <form className="space-y-6">
                      {currentForm.fields.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium text-gray-900">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                          </div>
                          {renderFieldPreview(field)}
                          {field.helperText && (
                            <p className="text-sm text-gray-600 italic">{field.helperText}</p>
                          )}
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <Button type="submit" className="w-full">
                          Submit Form
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              ) : (
                // Edit mode - show draggable fields
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="form-fields">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {currentForm.fields.map((field, index) => renderFormField(field, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Configuration */}
      {!previewMode && (
        <div className="w-80 border-l bg-white shadow-lg">
          <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Field Settings
            </h2>
            <p className="text-sm text-purple-100">Configure selected field</p>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            {selectedField ? (
              <div className="space-y-6">
                {/* Field Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Field Type</Label>
                  <Select 
                    value={fieldConfig.type} 
                    onValueChange={(value) => setFieldConfig(prev => ({ ...prev, type: value }))}
                  >
                    {mockFieldTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Basic Settings</h3>
                  
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={fieldConfig.label}
                      onChange={(e) => setFieldConfig(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Enter field label"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Placeholder Text</Label>
                    <Input
                      value={fieldConfig.placeholder}
                      onChange={(e) => setFieldConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Helper Text</Label>
                    <Textarea
                      value={fieldConfig.helperText}
                      onChange={(e) => setFieldConfig(prev => ({ ...prev, helperText: e.target.value }))}
                      placeholder="Additional help text for users"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Required Field</Label>
                      <p className="text-xs text-gray-600">Users must fill this field</p>
                    </div>
                    <Switch
                      checked={fieldConfig.required}
                      onCheckedChange={(checked) => setFieldConfig(prev => ({ ...prev, required: checked }))}
                    />
                  </div>
                </div>

                {/* Options for Select/Radio */}
                {(fieldConfig.type === 'select' || fieldConfig.type === 'radio') && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Options</h3>
                    
                    {fieldConfig.options?.length < 2 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm flex items-center gap-2">
                          ⚠️ At least 2 options required
                        </p>
                      </div>
                    )}
                    
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
                            placeholder={`Option ${idx + 1}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = fieldConfig.options.filter((_, i) => i !== idx);
                              setFieldConfig(prev => ({ ...prev, options: newOptions }));
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFieldConfig(prev => ({
                            ...prev,
                            options: [...(prev.options || []), `Option ${(prev.options?.length || 0) + 1}`]
                          }));
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                {/* Validation Settings */}
                {['text', 'email', 'textarea'].includes(fieldConfig.type) && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Validation</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Min Length</Label>
                        <Input
                          type="number"
                          value={fieldConfig.validation?.minLength || ''}
                          onChange={(e) => setFieldConfig(prev => ({
                            ...prev,
                            validation: { ...prev.validation, minLength: e.target.value }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Max Length</Label>
                        <Input
                          type="number"
                          value={fieldConfig.validation?.maxLength || ''}
                          onChange={(e) => setFieldConfig(prev => ({
                            ...prev,
                            validation: { ...prev.validation, maxLength: e.target.value }
                          }))}
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setCurrentForm(prev => ({
                        ...prev,
                        fields: prev.fields.map(f => f.id === selectedField.id ? fieldConfig : f)
                      }));
                    }}
                    className="flex-1"
                  >
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Select a field to configure its properties</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilderView;
