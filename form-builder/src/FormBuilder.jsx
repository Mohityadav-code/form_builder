import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddForm from './components/AddForm';
import FormBuilderView from './components/FormBuilderView';
import { Share, Edit3 } from 'lucide-react';
import { Button } from './ui';
import { getForms, getFormById, createForm, updateForm, deleteForm, submitForm, getFormSubmissions } from './api';

const FormBuilder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState({ name: '', description: '', template: '', fields: [] });
  const [selectedField, setSelectedField] = useState(null);
  const [fieldConfig, setFieldConfig] = useState({
    type: 'text', label: '', placeholder: '', helperText: '', required: false, options: [], validation: { minLength: '', maxLength: '', pattern: '' }
  });
  const [editingFormId, setEditingFormId] = useState(null);
  const [viewingForm, setViewingForm] = useState(null);
  const [userFormData, setUserFormData] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [userFormErrors, setUserFormErrors] = useState({});

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
      console.error('Failed to load forms:', e);
      alert('Failed to load forms');
    }
  }

  // Route-based logic
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      setViewingForm(null);
      setEditingFormId(null);
      setCurrentForm({ name: '', description: '', template: '', fields: [] });
      return;
    }
    if (location.pathname === '/add') {
      setCurrentForm({ name: '', description: '', template: '', fields: [] });
      setEditingFormId(null);
      setViewingForm(null);
      return;
    }
    if (id) {
      if (location.pathname.endsWith('/edit')) {
        // Edit mode
        getFormById(id).then(form => {
          setCurrentForm(form);
          setEditingFormId(id);
          setViewingForm(null);
        }).catch(() => navigate('/'));
      } else if (location.pathname.endsWith('/view')) {
        // View mode
        getFormById(id).then(form => {
          setViewingForm(form);
          setEditingFormId(null);
        }).catch(() => navigate('/'));
      } else if (location.pathname.endsWith('/public/preview')) {
        // Public preview mode
        getFormById(id).then(form => {
          setViewingForm(form);
          setEditingFormId(null);
        }).catch(() => navigate('/'));
      }
    }
    // eslint-disable-next-line
  }, [location.pathname, id]);

  // Fetch submissions for view route
  useEffect(() => {
    if (id && location.pathname.endsWith('/view')) {
      getFormSubmissions(id).then(setSubmissions).catch(() => setSubmissions([]));
    }
  }, [id, location.pathname]);

  // Handlers
  const handleCreateForm = () => navigate('/add');
  const handleViewForm = (id) => navigate(`/form/${id}/view`);


  const handleNextToBuilder = async () => {
    let draftForm = { ...currentForm };
    if (currentForm.template && currentForm.template !== 'blank') {
      const templateMeta = forms.find(f => f.name.toLowerCase().includes(currentForm.template));
      if (templateMeta) {
        try {
          const templateForm = await getFormById(templateMeta.id);
          draftForm.fields = [...templateForm.fields];
        } catch {}
      }
    }
    // Create draft form in backend
    try {
      const created = await createForm(draftForm);
      await loadForms();
      navigate(`/form/${created.id}/edit`);
    } catch {
      alert('Failed to create form');
    }
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
      if (editingFormId && editingFormId !== 'new') {
        await updateForm(editingFormId, currentForm);
      } else {
        await createForm(currentForm);
      }
      await loadForms();
      navigate('/');
    } catch (e) {
      console.error('Failed to save form:', e);
      alert('Failed to save form');
    }
  };

  const handleEditFromView = () => {
    if (viewingForm && viewingForm.id) {
      navigate(`/form/${viewingForm.id}/edit`);
    }
  };

  const handleDeleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      await deleteForm(id);
      await loadForms();
      alert('Form deleted');
      navigate('/');
    } catch {
      alert('Failed to delete form');
    }
  };

  const renderFieldPreview = (field) => {
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

  // Handler for user form submit
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const errors = {};
    if (viewingForm && viewingForm.fields) {
      viewingForm.fields.forEach(field => {
        if (field.required && (!userFormData[field.id] || userFormData[field.id].toString().trim() === '')) {
          errors[field.id] = 'This field is required';
        }
      });
    }
    setUserFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await submitForm(id, userFormData);
      setSubmitSuccess(true);
      setUserFormData({});
      setUserFormErrors({});
    } catch {
      alert('Failed to submit form');
    }
  };
  const handleEditForm = (id) => {
    navigate(`/form/${id}/edit`);
  };
  // Render logic based on route
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-fade-in">
        <div className="backdrop-blur-sm bg-white/30 shadow-lg border border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">📋</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Form Builder
                  </h1>
                  <p className="text-gray-600 text-sm">Create and manage your forms</p>
                </div>
              </div>
              <button 
                onClick={handleCreateForm}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>✨</span>
                  <span>Create New Form</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard 
            forms={forms} 
            handleCreateForm={handleCreateForm} 
            handleViewForm={handleViewForm} 
            handleDeleteForm={handleDeleteForm} 
            handleEditForm={handleEditForm} 
          />
        </div>
      </div>
    );
  }
  
  // Add Form Route
  if (location.pathname === '/add') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fade-in">
        <div className="backdrop-blur-sm bg-white/40 shadow-lg border border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <span className="text-gray-600 group-hover:text-gray-800 text-lg">←</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Create New Form
                  </h1>
                  <p className="text-gray-600 text-sm">Start building your form</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
            <AddForm 
              currentForm={currentForm} 
              setCurrentForm={setCurrentForm} 
              templates={forms} 
              setCurrentView={() => navigate('/')} 
              handleNextToBuilder={handleNextToBuilder} 
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Form Edit Route
  if (id && location.pathname.endsWith('/edit') && currentForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-fade-in">
        <div className="backdrop-blur-sm bg-white/40 shadow-lg border border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <span className="text-gray-600 group-hover:text-gray-800 text-lg">←</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Edit Form
                  </h1>
                  <p className="text-gray-600 text-sm">{currentForm.name || 'Untitled Form'}</p>
                </div>
              </div>
              <button 
                onClick={handleSaveForm}
                className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>💾</span>
                  <span>Save Form</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
            <FormBuilderView
              fieldTypes={fieldTypes}
              currentForm={currentForm}
              setCurrentView={() => navigate('/')}
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
          </div>
        </div>
      </div>
    );
  }
  
  // Form View Route
  if (id && location.pathname.endsWith('/view') && viewingForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 animate-fade-in">
        <div className="backdrop-blur-sm bg-white/40 shadow-lg border border-white/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <span className="text-gray-600 group-hover:text-gray-800 text-lg">←</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
                    {viewingForm.name}
                  </h1>
                  <p className="text-gray-600 text-sm">{viewingForm.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/form/${id}/public/preview`)}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button 
                  onClick={handleEditFromView}
                  className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Form Preview</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="space-y-6">
                {viewingForm.fields && viewingForm.fields.length > 0 ? (
                  viewingForm.fields.map((field, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <label className="block font-medium mb-2 text-gray-800">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        {renderFieldPreview(field)}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                      </div>
                      {field.helperText && (
                        <p className="text-sm text-gray-600 mt-2">{field.helperText}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p>No fields in this form yet.</p>
                  </div>
                )}
              </div>
            </div>
  
            {/* Submissions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Submissions ({submissions.length})
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📊</div>
                    <p>No submissions yet.</p>
                    <p className="text-sm mt-2">Share your form to start collecting responses!</p>
                  </div>
                ) : (
                  submissions.map((sub, idx) => (
                    <div 
                      key={idx} 
                      className="border border-gray-200/50 rounded-xl p-4 bg-gradient-to-r from-gray-50/50 to-white/50 hover:shadow-md transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(sub.data).map(([fid, val]) => (
                          <div key={fid} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <span className="font-medium text-gray-800">
                                {viewingForm.fields.find(f => String(f.id) === String(fid))?.label || fid}:
                              </span>
                              <span className="text-gray-700 ml-2">{val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Public Preview Route
  if (id && location.pathname.endsWith('/public/preview') && viewingForm) {
    if (submitSuccess) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center animate-fade-in">
          <div className="max-w-md mx-auto p-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-bounce-in">
              <div className="text-6xl mb-4 animate-pulse">✅</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Thank you!
              </h2>
              <p className="text-gray-700 text-lg">Your form has been submitted successfully.</p>
              <div className="mt-6 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 animate-fade-in">
        <div className="backdrop-blur-sm bg-white/40 shadow-lg border border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    {viewingForm.name}
                  </h1>
                  <p className="text-gray-600 text-lg">{viewingForm.description}</p>
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up">
            <form onSubmit={handleUserFormSubmit} className="space-y-8">
              {viewingForm.fields.map((field, idx) => (
                <div 
                  key={field.id} 
                  className="space-y-3 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <label className="block font-semibold text-gray-800 text-lg">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg resize-none ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      rows={4}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                    >
                      <option value="">Select an option...</option>
                      {field.options && field.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'checkbox' && (
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 group-hover:border-blue-400 transition-all duration-200"
                        checked={!!userFormData[field.id]}
                        onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.checked }))}
                        required={field.required}
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {field.label}
                      </span>
                    </label>
                  )}
                  
                  {field.type === 'radio' && field.options && (
                    <div className="space-y-3">
                      {field.options.map((option, idx) => (
                        <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name={`radio-${field.id}`}
                            value={option}
                            checked={userFormData[field.id] === option}
                            onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: option }))}
                            required={field.required}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 group-hover:ring-blue-300 transition-all duration-200"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {field.type === 'email' && (
                    <input
                      type="email"
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'date' && (
                    <input
                      type="date"
                      className={`w-full border-2 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm transition-all duration-200 focus:scale-105 focus:shadow-lg ${
                        userFormErrors[field.id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                    />
                  )}
                  
                  {userFormErrors[field.id] && (
                    <p className="text-red-500 text-sm font-medium animate-shake">
                      {userFormErrors[field.id]}
                    </p>
                  )}
                  
                  {field.helperText && (
                    <p className="text-gray-600 text-sm">{field.helperText}</p>
                  )}
                </div>
              ))}
              
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span>🚀</span>
                    <span>Submit Form</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default FormBuilder;
