import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

 

const QuestionBuilder = ({
  isOpen,
  onClose,
  onSave,
  editingQuestion,
}) => {
  const [questionData, setQuestionData] = useState({
    type: "text",
    question: "",
    placeholder: "",
    required: false,
    options: [],
  });

  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setQuestionData(editingQuestion);
    } else {
      setQuestionData({
        type: "text",
        question: "",
        placeholder: "",
        required: false,
        options: [],
      });
    }
  }, [editingQuestion]);

  const questionTypes = [
    { value: "text", label: "Text Input" },
    { value: "email", label: "Email" },
    { value: "number", label: "Number" },
    { value: "textarea", label: "Long Text" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "date", label: "Date" },
  ];

  const handleAddOption = () => {
    if (newOption.trim()) {
      setQuestionData({
        ...questionData,
        options: [...(questionData.options || []), newOption.trim()],
      });
      setNewOption("");
    }
  };

  const handleRemoveOption = (index) => {
    setQuestionData({
      ...questionData,
      options: questionData.options?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!questionData.question?.trim()) {
      alert("Please enter a question");
      return;
    }

    if (
      ["select", "radio", "checkbox"].includes(questionData.type) &&
      (!questionData.options || questionData.options.length < 2)
    ) {
      alert("Please add at least 2 options for this question type");
      return;
    }

    onSave(questionData );
  };

  const needsOptions = ["select", "radio", "checkbox"].includes(
    questionData.type || "text"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type</Label>
            <Select
              value={questionData.type}
              onValueChange={(value) =>
                setQuestionData({ ...questionData, type: value, options: [] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question Text *</Label>
            <Textarea
              id="question"
              placeholder="Enter your question..."
              value={questionData.question}
              onChange={(e) =>
                setQuestionData({ ...questionData, question: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder Text (Optional)</Label>
            <Input
              id="placeholder"
              placeholder="Enter placeholder text..."
              value={questionData.placeholder}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  placeholder: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={questionData.required}
              onCheckedChange={(checked) =>
                setQuestionData({ ...questionData, required: checked })
              }
            />
            <Label htmlFor="required">Required Question</Label>
          </div>

          {needsOptions && (
            <div className="space-y-4">
              <Label>Answer Options</Label>

              <div className="flex space-x-2">
                <Input
                  placeholder="Enter option..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddOption())
                  }
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {questionData.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>{option}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {questionData.options && questionData.options.length < 2 && (
                <p className="text-sm text-amber-600">
                  Add at least 2 options for this question type
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {editingQuestion ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionBuilder;
