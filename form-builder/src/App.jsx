import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddForm from './components/AddForm';
import FormBuilderView from './components/FormBuilderView';
import { Share } from 'lucide-react';
import { Button } from './ui';
import { getForms, getFormById, createForm, updateForm } from './api';

const FormBuilder = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState({ name: '', description: '', template: '', fields: [] });
  const [selectedField, setSelectedField] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFormForShare, setSelectedFormForShare] = useState(null);
  const [fieldConfig, setFieldConfig] = useState({
    type: 'text', label: '', placeholder: '', helperText: '', required: false, options: [], validation: { minLength: '', maxLength: '', pattern: '' }
  });
  const [editingFormId, setEditingFormId] = useState(null);

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

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      const data = await getForms();
      setForms(data);
    } catch (e) {
      alert('Failed to load forms');
    }
  }

  const handleCreateForm = () => {
    setCurrentView('add-form');
    setCurrentForm({ name: '', description: '', template: '', fields: [] });
    setEditingFormId(null);
  };

  const handleNextToBuilder = async () => {
    if (currentForm.template && currentForm.template !== 'blank') {
      // Try to find a template from backend (if exists)
      const templateMeta = forms.find(f => f.name.toLowerCase().includes(currentForm.template));
      if (templateMeta) {
        try {
          const templateForm = await getFormById(templateMeta.id);
        setCurrentForm(prev => ({ ...prev, fields: [...templateForm.fields] }));
        } catch {}
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
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : [],
      validation: { minLength: '', maxLength: '', pattern: '' }
    };
    setCurrentForm(prev => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setFieldConfig({ ...field });
  };

  const handleFieldUpdate = () => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === selectedField.id ? { ...fieldConfig } : f)
    }));
    setSelectedField(null);
    setFieldConfig({ type: 'text', label: '', placeholder: '', helperText: '', required: false, options: [] });
  };

  const handleSaveForm = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.map(e => `${e.fieldLabel}: ${e.errors.join(', ')}`).join('\n')}`);
      return;
    }
    try {
      if (editingFormId) {
        await updateForm(editingFormId, currentForm);
      } else {
        await createForm(currentForm);
      }
      await loadForms();
      setCurrentView('dashboard');
    } catch (e) {
      alert('Failed to save form');
    }
  };

  const handleEditForm = async (id) => {
    try {
      const form = await getFormById(id);
      setCurrentForm(form);
      setEditingFormId(id);
      setCurrentView('form-builder');
    } catch {
      alert('Form not found');
    }
  };

  const renderFieldPreview = (field) => {
    validateForm();
    const baseProps = { placeholder: field.placeholder, className: 'w-full' };
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return <input {...baseProps} type={field.type} />;
      case 'textarea':
        return <textarea {...baseProps} rows={3} />;
      case 'select':
        return (
          <select className="w-full">
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id={field.id} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor={field.id}>{field.label}</label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="radio" id={`${field.id}-${idx}`} name={field.id} className="text-blue-600 focus:ring-blue-500" />
                <label htmlFor={`${field.id}-${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return <input {...baseProps} type="date" />;
      case 'file':
        return <input {...baseProps} type="file" />;
      default:
        return <input {...baseProps} />;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(currentForm.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCurrentForm(prev => ({ ...prev, fields: items }));
  };

  const validateField = (field) => {
    const errors = [];
    if (['text', 'email', 'textarea'].includes(field.type)) {
      if (field.validation.minLength && field.validation.minLength < 1) {
        errors.push('Minimum length must be at least 1');
      }
      if (field.validation.maxLength && field.validation.maxLength < 1) {
        errors.push('Maximum length must be at least 1');
      }
      if (field.validation.minLength && field.validation.maxLength && parseInt(field.validation.minLength) > parseInt(field.validation.maxLength)) {
        errors.push('Minimum length cannot be greater than maximum length');
      }
    }
    if (['select', 'radio'].includes(field.type)) {
      if (!field.options || field.options.length < 2) {
        errors.push('Must have at least 2 options');
      }
    }
    if (field.type === 'checkbox') {
      if (!field.options || field.options.length < 1) {
        errors.push('Must have at least 1 option');
      }
    }
    return errors;
  };

  const validateForm = () => {
    const errors = [];
    currentForm.fields.forEach(field => {
      const fieldErrors = validateField(field);
      if (fieldErrors.length > 0) {
        errors.push({ fieldId: field.id, fieldLabel: field.label, errors: fieldErrors });
      }
    });
    return errors;
  };
  
  if (currentView === 'dashboard') {
    return <Dashboard forms={forms} handleCreateForm={handleCreateForm} handleShare={() => {}} handleEditForm={handleEditForm} />;
  }
  if (currentView === 'add-form') {
    return <AddForm currentForm={currentForm} setCurrentForm={setCurrentForm} templates={forms} setCurrentView={setCurrentView} handleNextToBuilder={handleNextToBuilder} />;
  }
  if (currentView === 'form-builder') {
    return (
      <FormBuilderView
        fieldTypes={fieldTypes}
        currentForm={currentForm}
        setCurrentView={setCurrentView}
        handleAddField={handleAddField}
        handleDragEnd={handleDragEnd}
        selectedField={selectedField}
        handleFieldSelect={handleFieldSelect}
        renderFieldPreview={renderFieldPreview}
        fieldConfig={fieldConfig}
        setFieldConfig={setFieldConfig}
        handleFieldUpdate={handleFieldUpdate}
        handleSaveForm={handleSaveForm}
        setCurrentForm={setCurrentForm}
        setSelectedField={setSelectedField}
      />
    );
  }
  return null;
};

export default FormBuilder;
