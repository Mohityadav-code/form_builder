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
    if (currentForm.template && currentForm.template !== 'blank') {
      const templateMeta = forms.find(f => f.name.toLowerCase().includes(currentForm.template));
      if (templateMeta) {
        try {
          const templateForm = await getFormById(templateMeta.id);
          setCurrentForm(prev => ({ ...prev, fields: [...templateForm.fields] }));
        } catch {
          alert('Failed to load template form');
          console.error('Failed to load template form:', templateMeta.id);
          return;
        }
      }
    }
    navigate('/form/new/edit');
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

  // Render logic based on route
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return <Dashboard forms={forms} handleCreateForm={handleCreateForm}  handleViewForm={handleViewForm} handleDeleteForm={handleDeleteForm} />;
  }
  if (location.pathname === '/add') {
    return <AddForm currentForm={currentForm} setCurrentForm={setCurrentForm} templates={forms} setCurrentView={() => navigate('/')} handleNextToBuilder={handleNextToBuilder} />;
  }
  if (id && location.pathname.endsWith('/edit') && currentForm) {
    return (
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
    );
  }
  if (id && location.pathname.endsWith('/view') && viewingForm) {
    return (
      <div className="h-screen flex bg-gray-50">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-center space-y-2 flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{viewingForm.name}</h1>
                <p className="text-gray-600">{viewingForm.description}</p>
              </div>
              <button className="ml-4 p-2 rounded hover:bg-gray-200" onClick={handleEditFromView} title="Edit">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </button>
            </div>
            <div className="space-y-4">
              {viewingForm.fields && viewingForm.fields.length > 0 ? (
                viewingForm.fields.map((field, idx) => (
                  <div key={idx} className="mb-4">
                    <label className="block font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {/* Render field preview (read-only) */}
                    {renderFieldPreview(field)}
                    {field.helperText && (
                      <p className="text-sm text-gray-600 mt-1">{field.helperText}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No fields in this form.</div>
              )}
            </div>
            {/* Show filled submissions */}
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2">Filled Submissions ({submissions.length})</h2>
              {submissions.length === 0 ? (
                <div className="text-gray-500">No submissions yet.</div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub, idx) => (
                    <div key={idx} className="border rounded p-3 bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">Submitted: {new Date(sub.submittedAt).toLocaleString()}</div>
                      <ul className="list-disc pl-5">
                        {Object.entries(sub.data).map(([fid, val]) => (
                          <li key={fid}><span className="font-medium">{viewingForm.fields.find(f => String(f.id) === String(fid))?.label || fid}:</span> {val}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (id && location.pathname.endsWith('/public/preview') && viewingForm) {
    if (submitSuccess) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you!</h2>
          <p>Your form has been submitted successfully.</p>
        </div>
      );
    }
    return (
      <div className="h-screen flex bg-gray-50">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{viewingForm.name}</h1>
              <p className="text-gray-600">{viewingForm.description}</p>
            </div>
            <form onSubmit={handleUserFormSubmit} className="space-y-6">
              {viewingForm.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="block font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                    >
                      <option value="">Select...</option>
                      {field.options && field.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'checkbox' && (
                    <input
                      type="checkbox"
                      className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      checked={!!userFormData[field.id]}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.checked }))}
                      required={field.required}
                    />
                  )}
                  {field.type === 'radio' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`radio-${field.id}`}
                            value={option}
                            checked={userFormData[field.id] === option}
                            onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: option }))}
                            required={field.required}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.type === 'email' && (
                    <input
                      type="email"
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      className={`w-full border rounded px-2 py-1 ${userFormErrors[field.id] ? 'border-red-500' : ''}`}
                      value={userFormData[field.id] || ''}
                      onChange={e => setUserFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      required={field.required}
                    />
                  )}
                  {userFormErrors[field.id] && (
                    <p className="text-red-500 text-sm">{userFormErrors[field.id]}</p>
                  )}
                  {field.helperText && (
                    <p className="text-gray-600 text-sm">{field.helperText}</p>
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default FormBuilder;
