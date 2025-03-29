import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react";

interface RatingLabel {
  value: number;
  label: string;
}

interface RatingQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  labels: RatingLabel[];
  startAtOne?: boolean;
  steps?: number;
  onSubmit?: (value: number) => void;
}

export const RatingQuestion: React.FC<RatingQuestionProps> = ({
  title,
  description,
  required = false,
  min = 0,
  max = 10,
  labels,
  startAtOne = false,
  steps,
  onSubmit,
}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate actual min/max based on startAtOne
  const actualMin = startAtOne ? 1 : min;
  const actualMax = steps ? actualMin + steps - 1 : max;

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (required && selectedValue === null) {
      setError("This question requires an answer");
      return;
    }

    if (selectedValue !== null && onSubmit) {
      onSubmit(selectedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(value);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (selectedValue !== null && selectedValue > actualMin) {
          handleSelect(selectedValue - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (selectedValue !== null && selectedValue < actualMax) {
          handleSelect(selectedValue + 1);
        } else if (selectedValue === null) {
          handleSelect(actualMin);
        }
        break;
    }
  };

  const numbers = Array.from(
    { length: actualMax - actualMin + 1 },
    (_, i) => actualMin + i
  );

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
        {/* Mobile Labels */}
        <div className="flex flex-col text-sm text-primary fill-primary leading-5 lg:hidden">
          {labels.map((label) => (
            <span key={label.value} className="flex items-center gap-0.5">
              <span>{label.value}</span>
              <ArrowRight className="h-4 w-4" />
              <span>{label.label}</span>
            </span>
          ))}
        </div>

        {/* Rating Boxes */}
        <div className="mt-2 lg:mt-0">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${numbers.length}, minmax(40px, 1fr))`,
            }}
            role="radiogroup"
            aria-required={required}
            aria-label={title}
          >
            {numbers.map((number) => (
              <div
                key={number}
                onClick={() => handleSelect(number)}
                onKeyDown={(e) => handleKeyDown(e, number)}
                role="radio"
                aria-checked={selectedValue === number}
                tabIndex={0}
                className={`
                  h-[60px] max-w-full
                  flex items-center justify-center
                  bg-primary/10 rounded cursor-pointer select-none
                  shadow-[0_0_0_1px_hsl(var(--primary))_inset]
                  text-primary text-base lg:text-xl
                  transition-[background-color] duration-100 ease-out
                  hover:bg-primary/30
                  focus:outline-none focus:shadow-[0_0_0_2px_hsl(var(--primary))_inset]
                  ${selectedValue === number ? 'text-white !bg-primary' : ''}
                  max-[600px]:h-[40px]
                `}
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Labels */}
        <div className="hidden lg:flex justify-between text-primary mt-4 px-0.5">
          {labels.map((label) => (
            <span key={label.value} className={`
              ${label.value === Math.floor(numbers.length / 2) ? 'translate-x-5' : ''}
            `}>
              {label.label}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={required && selectedValue === null}
          >
            Submit
          </Button>
        </div>
      </div>
    </QuestionSkeleton>
  );
};