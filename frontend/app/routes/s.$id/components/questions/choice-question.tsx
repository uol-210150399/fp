import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";

interface Choice {
  label: string;
  value: string;
}

interface ChoiceQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  choices: Choice[];
  onSubmit?: (value: string, otherValue?: string) => void;
}

const CheckIcon = () => (
  <svg height="13" width="16" className="fill-current">
    <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z"></path>
  </svg>
);

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  title,
  description,
  required,
  choices,
  onSubmit,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [otherValue, setOtherValue] = useState("");

  const handleChoiceClick = (choiceValue: string) => {
    setSelectedValue(choiceValue);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherValue(e.target.value);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedValue, selectedValue === "other" ? otherValue : undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
    >
      <div className="mt-8">
        <ul className="flex flex-col gap-2 w-fit">
          {choices.map((choice, index) => (
            <li
              key={choice.value}
              className={`
                flex items-center justify-between text-[#0142AC] 
                shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset] 
                bg-[#0142AC]/10 px-0 py-1 cursor-pointer rounded 
                select-none hover:bg-[#0142AC]/30
                ${selectedValue === choice.value ? 'shadow-[0_0_0_2px_rgba(1,66,172,0.8)_inset]' : ''}
              `}
              onClick={() => handleChoiceClick(choice.value)}
            >
              <div className="flex items-center justify-center">
                <div className={`
                  flex items-center justify-center p-1.5 
                  bg-white/80 text-xs font-bold
                  shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset] 
                  rounded-sm h-[22px] w-[22px] mx-2
                  ${selectedValue === choice.value ? 'bg-[#0142AC] ' : ''}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                {choice.value === "other" ? (
                  <input
                    type="text"
                    placeholder="Type your answer"
                    className={`
                      bg-transparent border-none outline-none 
                      text-[#0142AC] text-xl max-w-[200px]
                      placeholder:text-[#0142AC]/80 placeholder:text-base
                      ${selectedValue === "other" ? 'block' : 'hidden'}
                    `}
                    value={otherValue}
                    onChange={handleOtherInputChange}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : null}
                <span className={`text-xl ${selectedValue === "other" && choice.value === "other" ? 'hidden' : 'block'}`}>
                  {choice.label}
                </span>
              </div>
              <div className={`
                flex items-center justify-center rounded px-2 py-0 h-[30px]
                ${selectedValue === choice.value ? 'visible opacity-100' : 'invisible opacity-0'}
                ${selectedValue === "other" && choice.value === "other" ? 'bg-[#0142AC] fill-white' : ''}
              `}>
                <CheckIcon />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-3 max-[600px]:fixed max-[600px]:z-10 max-[600px]:left-0 max-[600px]:bottom-0 max-[600px]:w-full max-[600px]:px-4">
        <button
          onClick={handleSubmit}
          className="font-bold cursor-pointer bg-[#0142AC] text-white outline-none shadow-[0_3px_12px_0_rgba(0,0,0,0.1)] px-[14px] rounded h-10 text-xl uppercase transition-colors duration-100 hover:bg-[#275EB8] max-[600px]:w-full"
        >
          OK
        </button>
      </div>
    </QuestionSkeleton>
  );
};