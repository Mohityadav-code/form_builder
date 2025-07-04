import React from 'react';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Button,
  Card,
  CardContent,
  Label,
  Select,
  SelectItem,
  Textarea,
  Input,
  Switch,
  Separator
} from '../ui';

const FormBuilderView = ({
  fieldTypes,
  currentForm,
  setCurrentView,
  handleAddField,
  handleDragEnd,
  selectedField,
  handleFieldSelect,
  renderFieldPreview,
  fieldConfig,
  setFieldConfig,
  handleFieldUpdate,
  handleSaveForm,
  setCurrentForm,
  setSelectedField
}) => (
  <div className="h-screen flex bg-gray-50">
    {/* Left Sidebar - Field Types */}
    <div className="w-80 border-r bg-white p-4 space-y-4 overflow-y-auto">
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
            className="w-full justify-start gap-2 h-auto p-3 hover:bg-blue-50 hover:border-blue-300"
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
          <h1 className="text-2xl font-bold text-gray-900">{currentForm.name}</h1>
          <p className="text-gray-600">{currentForm.description}</p>
        </div>
        <div className="space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {currentForm.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <Card 
                            key={field.id} 
                            className={`cursor-pointer transition-all ${selectedField?.id === field.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
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
                                <p className="text-sm text-gray-600 mt-1">{field.helperText}</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {currentForm.fields.length === 0 && (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No fields added yet. Click on field types to add them.</p>
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
    <div className="w-80 border-l bg-white p-4 space-y-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Field Configuration</h2>
      {selectedField ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select value={fieldConfig.type} onValueChange={(value) => setFieldConfig(prev => ({ ...prev, type: value }))}>
              {fieldTypes.map((type) => (
                <SelectItem key={type.type} value={type.type}>
                  {type.label}
                </SelectItem>
              ))}
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
          {(['text', 'email', 'textarea'].includes(fieldConfig.type)) && (
            <>
              <div className="space-y-2">
                <Label>Minimum Length</Label>
                <Input
                  type="number"
                  value={fieldConfig.validation?.minLength}
                  onChange={(e) => setFieldConfig(prev => ({
                    ...prev,
                    validation: { ...prev.validation, minLength: e.target.value }
                  }))}
                  placeholder="Minimum characters"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Length</Label>
                <Input
                  type="number"
                  value={fieldConfig.validation?.maxLength}
                  onChange={(e) => setFieldConfig(prev => ({
                    ...prev,
                    validation: { ...prev.validation, maxLength: e.target.value }
                  }))}
                  placeholder="Maximum characters"
                />
              </div>
            </>
          )}
          {(fieldConfig.type === 'select' || fieldConfig.type === 'radio') && (
            fieldConfig.options.length < 2 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">⚠️ At least 2 options required</p>
              </div>
            )
          )}
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          <p>Select a field to configure its properties</p>
        </div>
      )}
    </div>
  </div>
);

export default FormBuilderView; 
