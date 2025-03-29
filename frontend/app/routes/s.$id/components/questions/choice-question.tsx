import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react";

interface Choice {
  label: string;
  value: string;
}

interface ChoiceQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  choices: Choice[];
  allowMultiple?: boolean;
  onSubmit?: (values: { id: string; text: string }[]) => void;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  title,
  description,
  required = false,
  choices,
  allowMultiple = false,
  onSubmit,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [otherValue, setOtherValue] = useState("");

  const handleChoiceClick = (choiceValue: string) => {
    setSelectedValues(prev => {
      if (allowMultiple) {
        // Toggle selection for multiple choice
        return prev.includes(choiceValue)
          ? prev.filter(v => v !== choiceValue)
          : [...prev, choiceValue];
      } else {
        // Single selection
        return [choiceValue];
      }
    });
    if (error) setError(null);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherValue(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (required && selectedValues.length === 0) {
      setError("This question requires an answer");
      return;
    }


    if (onSubmit) {
      const selectedChoices = selectedValues.map((value) => ({
        id: value,
        text: choices.find((choice) => choice.value === value)?.label || "",
      }));
      onSubmit(selectedChoices);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
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
      <div className="mt-8">
        <ul className="flex flex-col gap-2 w-fit">
          {choices.map((choice, index) => (
            <li
              key={choice.value}
              className={`
                flex items-center justify-between text-primary 
                shadow-[0_0_0_1px_hsl(var(--primary))_inset] 
                bg-primary/10 px-0 py-1 cursor-pointer rounded 
                select-none hover:bg-primary/30
                ${selectedValues.includes(choice.value) ? 'shadow-[0_0_0_2px_hsl(var(--primary))_inset]' : ''}
              `}
              onClick={() => handleChoiceClick(choice.value)}
            >
              <div className="flex items-center px-3 justify-center">
                <span className={`text-xl`}>
                  {choice.label}
                </span>
              </div>
              <div className={`
                flex items-center justify-center rounded px-2 py-0 h-[30px]
                ${selectedValues.includes(choice.value) ? 'visible opacity-100' : 'invisible opacity-0'}
              `}>
                <Check className="h-4 w-4" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={required && selectedValues.length === 0}
        >
          Submit
        </Button>
      </div>
    </QuestionSkeleton>
  );
};