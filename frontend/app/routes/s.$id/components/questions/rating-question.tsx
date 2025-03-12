import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";

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
  onSubmit?: (value: number) => void;
}

const SmallArrowIcon = () => (
  <svg height="8" width="7">
    <path d="M5 3.5v1.001H-.002v-1z"></path>
    <path d="M4.998 4L2.495 1.477 3.2.782 6.416 4 3.199 7.252l-.704-.709z"></path>
  </svg>
);

export const RatingQuestion: React.FC<RatingQuestionProps> = ({
  title,
  description,
  required,
  min = 0,
  max = 10,
  labels,
  onSubmit,
}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleSubmit = () => {
    if (selectedValue !== null && onSubmit) {
      onSubmit(selectedValue);
    }
  };

  const numbers = Array.from(
    { length: max - min + 1 },
    (_, i) => min + i
  );

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
    >
      <div className="mt-8">
        {/* Mobile Labels */}
        <div className="flex flex-col text-sm text-[#0142AC] fill-[#0142AC] leading-5 lg:hidden">
          {labels.map((label) => (
            <span key={label.value} className="flex items-center gap-0.5">
              <span>{label.value}</span>
              <SmallArrowIcon />
              <span>{label.label}</span>
            </span>
          ))}
        </div>

        {/* Rating Boxes */}
        <div className="mt-2 lg:mt-0">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
            }}
          >
            {numbers.map((number) => (
              <div
                key={number}
                onClick={() => handleSelect(number)}
                className={`
                  h-[60px] max-w-full
                  flex items-center justify-center
                  bg-[rgba(1,66,172,0.1)] rounded cursor-pointer select-none
                  shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset]
                  text-[#0142AC] text-base lg:text-xl
                  transition-[background-color] duration-100 ease-out
                  hover:bg-[rgba(1,66,172,0.3)]
                  ${selectedValue === number ? 'text-[rgb(230,236,247)] !bg-[#0142AC]' : ''}
                  max-[600px]:h-[40px]
                `}
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Labels */}
        <div className="hidden lg:flex justify-between text-[#0142AC] mt-4 px-0.5">
          {labels.map((label) => (
            <span key={label.value} className={`
              ${label.value === 5 ? 'translate-x-5' : ''}
            `}>
              {label.label}
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex items-center gap-3 max-[600px]:fixed max-[600px]:z-10 max-[600px]:left-0 max-[600px]:bottom-0 max-[600px]:w-full max-[600px]:px-4">
          <button
            onClick={handleSubmit}
            className="font-bold cursor-pointer bg-[#0142AC] text-white outline-none shadow-[0_3px_12px_0_rgba(0,0,0,0.1)] px-[14px] rounded h-10 text-xl uppercase transition-colors duration-100 hover:bg-[#275EB8] max-[600px]:w-full"
          >
            OK
          </button>
        </div>
      </div>
    </QuestionSkeleton>
  );
};