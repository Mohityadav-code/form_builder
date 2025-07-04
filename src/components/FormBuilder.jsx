import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Eye, Settings } from "lucide-react";
import QuestionBuilder from "./QuestionBuilder";
import FormPreview from "./FormPreview";
import { mockTemplates } from "./data/templates";

const FormBuilder = ({ formConfig }) => {
  const [questions, setQuestions] = useState(() => {
    if (formConfig?.template) {
      const template = mockTemplates.find((t) => t.id === formConfig.template);
      return template ? template.questions : [];
    }
    return [];
  });

  const [isQuestionBuilderOpen, setIsQuestionBuilderOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleAddQuestion = (question) => {
    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, { ...question, id: Date.now().toString() }]);
    }
    setIsQuestionBuilderOpen(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsQuestionBuilderOpen(true);
  };

  const handleDeleteQuestion = (questionId) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  const handleMoveQuestion = (fromIndex, toIndex) => {
    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Form Questions ({questions.length})</CardTitle>
                <Button
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsQuestionBuilderOpen(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-4">No questions added yet</p>
                  <p className="text-sm">
                    Click "Add Question" to start building your form
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={() => handleEditQuestion(question)}
                      onDelete={() => handleDeleteQuestion(question.id)}
                      onMoveUp={
                        index > 0
                          ? () => handleMoveQuestion(index, index - 1)
                          : undefined
                      }
                      onMoveDown={
                        index < questions.length - 1
                          ? () => handleMoveQuestion(index, index + 1)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <FormPreview questions={questions} formConfig={formConfig} />
        </TabsContent>
      </Tabs>

      {isQuestionBuilderOpen && (
        <QuestionBuilder
          isOpen={isQuestionBuilderOpen}
          onClose={() => {
            setIsQuestionBuilderOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleAddQuestion}
          editingQuestion={editingQuestion}
        />
      )}
    </div>
  );
};


const QuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Q{index + 1}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
                {question.type}
              </span>
              {question.required && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Required
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              {question.question}
            </h3>
            {question.options && (
              <div className="text-sm text-gray-600">
                Options: {question.options.join(", ")}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {onMoveUp && (
              <Button variant="ghost" size="sm" onClick={onMoveUp}>
                ↑
              </Button>
            )}
            {onMoveDown && (
              <Button variant="ghost" size="sm" onClick={onMoveDown}>
                ↓
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormBuilder;
