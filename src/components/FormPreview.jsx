import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

 

const FormPreview  = ({ questions, formConfig }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState ({});

  const handleInputChange = (questionId, value) => {
    setFormData({ ...formData, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    questions.forEach((question) => {
      if (
        question.required &&
        (!formData[question.id] || formData[question.id] === "")
      ) {
        newErrors[question.id] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formData);
    alert("Form submitted successfully! Check console for data.");
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || "";
    const error = errors[question.id];

    switch (question.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={error ? "border-red-500" : ""}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleInputChange(question.id, val)}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleInputChange(question.id, val)}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${option}`}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleInputChange(question.id, [
                        ...currentValues,
                        option,
                      ]);
                    } else {
                      handleInputChange(
                        question.id,
                        currentValues.filter((v) => v !== option)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => handleInputChange(question.id, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{formConfig.name}</CardTitle>
        {formConfig.description && (
          <p className="text-gray-600 mt-2">{formConfig.description}</p>
        )}
        {formConfig.registrationDeadline && (
          <p className="text-sm text-amber-600 mt-2">
            Registration closes on{" "}
            {format(formConfig.registrationDeadline, "PPP")}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>
              No questions added yet. Go to the Builder tab to add questions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-base font-medium">
                  {index + 1}. {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>

                {renderQuestion(question)}

                {errors[question.id] && (
                  <p className="text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              Submit Form
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FormPreview;
