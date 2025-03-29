import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";

interface NumberQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  onSubmit?: (value: number) => void;
}

export const NumberQuestion: React.FC<NumberQuestionProps> = ({
  title,
  description,
  required = false,
  min,
  max,
  placeholder = "Type your answer here...",
  onSubmit,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string or numbers only (including negative and decimals)
    if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
      setValue(newValue);
      if (error) setError(null);
    }
  };

  const validateNumber = (num: number): string | null => {
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    if (min !== undefined && min !== null && num < min) {
      return `Number must be at least ${min}`;
    }
    if (max !== undefined && max !== null && num > max) {
      return `Number must be at most ${max}`;
    }
    return null;
  };

  const handleSubmit = () => {
    if (required && !value.trim()) {
      setError("This question requires an answer");
      return;
    }

    const numValue = parseFloat(value);
    const validationError = validateNumber(numValue);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (onSubmit) {
      onSubmit(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getHelperText = () => {
    let hint = '';

    // Add range hint if either min or max exists and is not null
    if ((min !== undefined && min !== null) || (max !== undefined && max !== null)) {
      if (min !== undefined && min !== null && max !== undefined && max !== null) {
        hint = `Enter a number between ${min} and ${max}`;
      } else if (min !== undefined && min !== null) {
        hint = `Enter a number ${min} or greater`;
      } else if (max !== undefined && max !== null) {
        hint = `Enter a number up to ${max}`;
      }
    }

    return hint;
  };

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
      error={error}
    >
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <Hash className="absolute left-0 top-2 h-5 w-5 text-primary/40" />
          <input
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`
              w-full border-none outline-none text-secondary-foreground pb-2 text-3xl 
              bg-transparent placeholder:text-primary/30 pl-8
              transition-shadow duration-100 ease-out
              shadow-primary/30 
              focus:shadow-primary
              ${error ? 'shadow-destructive' : ''}
            `}
          />
        </div>

        <p className="text-sm text-primary/70 flex items-center gap-1">
          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">123</span>
          {getHelperText() || "Enter a number"}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={required && !value.trim()}
          >
            Submit
          </Button>
          <p className="text-xs leading-4 hidden lg:block">
            press <strong className="tracking-[0.2px]">Enter ↵</strong>
          </p>
        </div>
      </div>
    </QuestionSkeleton>
  );
};