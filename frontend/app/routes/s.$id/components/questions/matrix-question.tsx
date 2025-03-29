import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button"

interface MatrixOption {
  id: string;
  label: string;
  value: string | null;
}

interface MatrixColumn {
  id: string;
  label: string;
}

interface MatrixQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  options: MatrixOption[];
  columns: MatrixColumn[];
  onSubmit?: (answers: MatrixOption[]) => void;
}

export const MatrixQuestion: React.FC<MatrixQuestionProps> = ({
  title,
  description,
  required = false,
  options,
  columns,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<MatrixOption[]>(options);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (optionId: string, columnId: string) => {
    setAnswers(prev =>
      prev.map(option =>
        option.id === optionId
          ? { ...option, value: columnId }
          : option
      )
    );
    setHasChanges(true);
    if (error) setError(null);
  };

  const handleReset = () => {
    setAnswers(options);
    setHasChanges(false);
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (required) {
      const unanswered = answers.some(option => !option.value);
      if (unanswered) {
        setError("Please answer all rows");
        return;
      }
    }

    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: string, columnId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange(optionId, columnId);
    }
  };

  // Calculate minimum width based on number of columns
  const minTableWidth = `max(720px, ${columns.length * 150 + 200}px)`;

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
        <div className="overflow-x-auto">
          <div style={{ minWidth: minTableWidth }}>
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[10px_16px] h-12 text-left sticky left-0 z-[1] bg-white">
                    <span className="sr-only">Options</span>
                  </th>
                  {columns.map(column => (
                    <th key={column.id} className="p-[10px_16px] h-12 text-center">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {answers.map(option => (
                  <tr
                    key={option.id}
                    className="shadow-[0_0_0_100vh_rgba(1,66,172,0.1)_inset] rounded"
                  >
                    <td className="p-[10px_16px] h-12 sticky left-0 z-[1] bg-white 
                      shadow-[0_0_0_100vh_rgba(1,66,172,0.1)_inset] max-w-[200px] break-words">
                      {option.label}
                    </td>
                    {columns.map(column => (
                      <td key={column.id} className="p-[10px_16px] h-12">
                        <div className="flex items-center justify-center">
                          <div
                            role="radio"
                            aria-checked={option.value === column.id}
                            tabIndex={0}
                            onClick={() => handleChange(option.id, column.id)}
                            onKeyDown={(e) => handleKeyDown(e, option.id, column.id)}
                            className={`
                              appearance-none cursor-pointer border border-primary 
                              bg-white h-5 w-5 rounded-full relative outline-none
                              hover:border-primary hover:bg-primary/10
                              focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                              transition-all duration-200 ease-out
                              [-webkit-tap-highlight-color:transparent]
                              ${option.value === column.id ? 'border-primary border-[6px]' : ''}
                            `}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {hasChanges && (
          <button
            onClick={handleReset}
            className="mt-4 text-primary underline cursor-pointer text-base leading-6
              [-webkit-tap-highlight-color:transparent]
              max-[600px]:text-sm max-[600px]:leading-5"
          >
            Clear all
          </button>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={required && !hasChanges}
          >
            Submit
          </Button>
        </div>
      </div>
    </QuestionSkeleton>
  );
};