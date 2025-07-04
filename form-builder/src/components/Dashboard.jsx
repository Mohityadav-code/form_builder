import React, { useState } from 'react';
import { Plus, Edit3, Eye, Trash2, Share, X } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';

const Dashboard = ({ forms, handleCreateForm, handleEditForm, handleViewForm, handleDeleteForm }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareForm, setShareForm] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShareClick = (form) => {
    setShareForm(form);
    setShareModalOpen(true);
    setCopied(false);
  };

  const handleCopy = () => {
    if (shareForm) {
      const url = `${window.location.origin}/form/${shareForm.id}/public/preview`;
      navigator.clipboard.writeText(url);
      setCopied(true);
    }
  };

  return (
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
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleViewForm(form.id)}>
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleEditForm(form.id)}>
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteForm(form.id)}>
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleShareClick(form)}
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
      {/* Share Modal */}
      {shareModalOpen && shareForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100" onClick={() => setShareModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Share Form</h2>
            <p className="mb-4 text-gray-600">Copy the link below to share this form:</p>
            <div className="flex items-center gap-2 mb-4">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm bg-gray-100"
                value={`${window.location.origin}/form/${shareForm.id}/public/preview`}
                readOnly
              />
              <Button size="sm" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
            <div className="text-xs text-gray-500">Anyone with this link can view and fill out the form.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
