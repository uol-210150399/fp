import { QuestionSkeleton } from "./question-skeleton"
import { Button } from "@/components/ui/button"

interface StatementQuestionProps {
  title: string
  description?: string
  buttonText?: string
  onSubmit?: (value: string) => void
}

export const StatementQuestion: React.FC<StatementQuestionProps> = ({
  title,
  description,
  buttonText = "Continue",
  onSubmit,
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(buttonText)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
    >
      <div className="flex flex-col items-start">
        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
          >
            {buttonText || "Continue"}
          </Button>
          <p className="text-xs leading-4 hidden lg:block">
            press <strong className="tracking-[0.2px]">Enter ↵</strong>
          </p>
        </div>
      </div>
    </QuestionSkeleton>
  )
} 