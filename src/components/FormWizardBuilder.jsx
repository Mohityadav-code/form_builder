import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormSetupModal from "./FormSetupModal";
import FormBuilder from "./FormBuilder";

const FormWizardBuilder = () => {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [formConfig, setFormConfig] = useState(null);

  const handleFormSetup = (config) => {
    setFormConfig(config);
    setIsSetupModalOpen(false);
  };

  const handleNewForm = () => {
    setFormConfig(null);
    setIsSetupModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {!formConfig ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Form Wizard Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Create beautiful, interactive forms with our drag-and-drop
                  builder
                </p>
                <Button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  Create New Form
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {formConfig.name}
                </h1>
                <p className="text-gray-600">{formConfig.description}</p>
              </div>
              <Button onClick={handleNewForm} variant="outline">
                New Form
              </Button>
            </div>
            <FormBuilder formConfig={formConfig} />
          </div>
        )}

        <FormSetupModal
          isOpen={isSetupModalOpen}
          onClose={() => setIsSetupModalOpen(false)}
          onSetup={handleFormSetup}
        />
      </div>
    </div>
  );
};

export default FormWizardBuilder;
