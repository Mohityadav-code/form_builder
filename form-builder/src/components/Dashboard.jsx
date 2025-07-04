import React from 'react';
import { Plus, Edit3, Eye, Trash2, Share } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';

const Dashboard = ({ forms, handleCreateForm, handleShare, handleEditForm }) => (
  <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
        <p className="text-gray-600">Create and manage your forms</p>
      </div>
      <Button onClick={handleCreateForm} className="flex items-center gap-2">
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
            </CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Created: {new Date(form.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleEditForm(form.id)}>
                  <Edit3 className="h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleShare(form)}
                >
                  <Share className="h-3 w-3" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Dashboard; 
