import { QuestionSkeleton } from "./question-skeleton";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"

interface TextQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export const TextQuestion = ({
  title,
  description,
  required = false,
  maxLength = 500,
  placeholder = "Type your answer here...",
  onSubmit,
}: TextQuestionProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSubmit = () => {
    if (required && !value.trim()) {
      setError("This question requires an answer");
      return;
    }

    if (onSubmit) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          className={`
            w-full min-h-[3rem] border-none resize-none outline-none text-secondary-foreground pb-2 text-xl 
            bg-transparent placeholder:text-primary/30 
            transition-shadow duration-100 ease-out
            shadow-primary/30 
            focus:shadow-primary
            ${error ? 'shadow-destructive' : ''}
          `}
        />
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
