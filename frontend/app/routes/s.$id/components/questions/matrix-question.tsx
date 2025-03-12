import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";

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
  required,
  options,
  columns,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<MatrixOption[]>(options);
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
  };

  const handleClear = () => {
    setAnswers(options);
    setHasChanges(false);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  // Calculate minimum width based on number of columns
  const minTableWidth = `max(720px, ${columns.length * 150 + 112}px)`;

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
    >
      <div className="mt-8">
        <div className="text-base leading-6 text-[#0142AC] font-normal overflow-x-auto">
          <div style={{ minWidth: minTableWidth }}>
            <table className="w-full border-separate border-spacing-y-2 table-fixed">
              <colgroup>
                <col className="w-28" /> {/* First column fixed at 112px */}
                {columns.map(col => (
                  <col key={col.id} className="min-w-[150px]" />
                ))}
              </colgroup>

              <thead>
                <tr>
                  <th className="font-normal p-[10px_16px] bg-white"></th>
                  {columns.map(column => (
                    <th
                      key={column.id}
                      className="font-normal p-[10px_16px] break-words bg-white"
                    >
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
                    <td className="p-[10px_16px] h-12 sticky left-0 z-[1] bg-white shadow-[0_0_0_100vh_rgba(1,66,172,0.1)_inset] max-w-[112px] break-words">
                      {option.label}
                    </td>
                    {columns.map(column => (
                      <td key={column.id} className="p-[10px_16px] h-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="radio"
                            name={option.id}
                            checked={option.value === column.id}
                            onChange={() => handleChange(option.id, column.id)}
                            className={`
                              appearance-none cursor-pointer border border-[rgba(1,66,172,0.8)] 
                              bg-white h-5 w-5 rounded-full relative 
                              checked:after:content-[''] checked:after:h-2.5 checked:after:w-2.5 
                              checked:after:bg-[#0142AC] checked:after:absolute checked:after:rounded-full 
                              checked:after:top-1/2 checked:after:left-1/2 
                              checked:after:-translate-x-1/2 checked:after:-translate-y-1/2
                              [-webkit-tap-highlight-color:transparent]
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
          <p
            onClick={handleClear}
            className="mt-4 text-[#0142AC] underline cursor-pointer text-base leading-6
              [-webkit-tap-highlight-color:transparent]
              max-[600px]:text-sm max-[600px]:leading-5"
          >
            Clear all
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 max-[600px]:fixed max-[600px]:z-10 max-[600px]:left-0 max-[600px]:bottom-0 max-[600px]:w-full max-[600px]:px-4">
          <button
            onClick={handleSubmit}
            className="font-bold cursor-pointer bg-[#0142AC] text-white outline-none 
              shadow-[0_3px_12px_0_rgba(0,0,0,0.1)] px-[14px] rounded h-10 text-xl 
              uppercase transition-colors duration-100 hover:bg-[#275EB8] max-[600px]:w-full"
          >
            OK
          </button>
        </div>
      </div>
    </QuestionSkeleton>
  );
};