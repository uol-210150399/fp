import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";

interface TextQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
  title,
  description,
  required,
  maxLength,
  placeholder = "Type your answer here...",
  onSubmit,
}) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
    >
      <input
        type="text"
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border-none outline-none text-[#0142AC] pb-2 text-3xl bg-transparent placeholder:text-[#0142AC]/30 transition-shadow duration-100 ease-out shadow-[0_1px_rgba(1,66,172,0.3)] focus:shadow-[0_2px_rgba(1,66,172,1)]"
      />
    </QuestionSkeleton>
  );
}