import React, { useState } from 'react';
import { Plus, Edit3, Eye, Trash2, Share, X } from 'lucide-react';

const Dashboard = ({ forms, handleCreateForm, handleEditForm, handleViewForm, handleDeleteForm }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareForm, setShareForm] = useState(null);
  const [copied, setCopied] = useState(false);
  console.log('Dashboard component rendered with forms:', forms);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Form Builder
            </h1>
            <p className="text-slate-600 text-lg">Create and manage your forms with ease</p>
          </div>
          <button
            onClick={handleCreateForm}
            className="group relative inline-flex items-center gap-3 px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            Add New Form
          </button>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forms.map((form) => (
            <div
              key={form.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/90"
            >
              {/* Card Header */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200">
                  {form.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{form.description}</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500">
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewForm(form.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditForm(form.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={() => handleShareClick(form)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  <Share className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-lg"></div>
            </div>
          ))}
        </div>

        {/* Share Modal */}
        {shareModalOpen && shareForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
                onClick={() => setShareModalOpen(false)}
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>

              {/* Modal Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Share Form</h2>
                  <p className="text-slate-600">Copy the link below to share this form with others</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
                      value={`${window.location.origin}/form/${shareForm.id}/public/preview`}
                      readOnly
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        copied
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Anyone with this link can view and fill out the form.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;