import { DraggableProvided } from "@hello-pangea/dnd"
import { useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react"
import { QuestionTypeSwitcher } from "./field-switcher"
import { SurveyFieldTypeEnum } from "@/backend.types"

interface FieldContainerProps {
  dragEnablerProps: DraggableProvided
  isDragging?: boolean
  disabled?: boolean
  sectionId: string
  onDuplicateQuestion: () => void
  onRemoveQuestion: () => void
  fieldId: string
}

export const Field = ({
  dragEnablerProps,
  isDragging,
  disabled,
  onDuplicateQuestion,
  onRemoveQuestion,
  fieldId,
}: FieldContainerProps) => {
  const formContext = useFormContext()

  const ref = useRef<HTMLDivElement | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)

  const sectionField = useWatch({
    control: formContext.control,
    name: fieldId,
  })

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      id={fieldId}
      ref={dragEnablerProps.innerRef}
      {...dragEnablerProps.draggableProps}
      data-testId="interview-question"
      className={cn(
        "flex flex-col gap-2 group relative bg-background",
        isDragging && "shadow-md"
      )}
    >
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col gap-2 rounded-lg border",
          isDragging && "border-blue-100",
        )}
        {...dragEnablerProps.dragHandleProps}
      >
        <div className="cursor-default">
          <div className="relative py-1 px-2">
            <div className="flex items-center gap-2">
              <QuestionTypeSwitcher
                selectedType={formContext.getValues(`${fieldId}.type`)}
                onSelect={(type) => {

                  const existingQuestion = formContext.getValues(fieldId)
                  const updatedQuestion = generateField(type)

                  formContext.setValue(fieldId, {
                    ...updatedQuestion,
                    ...(updatedQuestion.type === SurveyFieldTypeEnum.Checkpoint ? { condition: "" } : { title: existingQuestion.type !== SurveyFieldTypeEnum.Checkpoint ? existingQuestion.title : "" }),
                    id: existingQuestion.id,
                  })
                }}
              />
              <div
                className={cn(
                  "ml-auto flex flex-row transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                )}
              >
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon size={14} />
                        ) : (
                          <ChevronDownIcon size={14} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={16}>
                      {isExpanded ? "Hide details" : "Show details"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="mt-2 "
                  >
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={onDuplicateQuestion}
                    >
                      <CopyIcon className="h-4 w-4 mr-2" size={14} />
                      Duplicate
                    </DropdownMenuItem>
                    {!disabled && (
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={onRemoveQuestion}
                      >
                        <TrashIcon className="h-4 w-4 mr-2" size={14} />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <FormField
              name={sectionField.type === SurveyFieldTypeEnum.Checkpoint ? `${fieldId}.condition` : `${fieldId}.title`}
              render={({ field }) => (
                <FormItem className="space-y-1.5 flex-1 text-start">
                  <FormControl>
                    <Textarea
                      className="bg-accent/40 text-sm rounded-md resize-none focus-visible:bg-accent hover:bg-accent text-foreground w-full font-medium border-none shadow-none focus-visible:ring-0"
                      placeholder={
                        sectionField.type === SurveyFieldTypeEnum.Checkpoint ? "Type your condition here..." : "Type your question here..."
                      }
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      id={`${fieldId}.title`}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      {isExpanded ? (
        <Collapsible open={isExpanded} className={cn("flex flex-col")}>
          <CollapsibleContent className="p-4 rounded-md shadow-none border overflow-visible">
            {QComponent && (
              <QComponent
                disabled={disabled}
                questionFormKey={questionFormKey}
                topicId={topicId}
                onCancel={() => {
                  updateExpandedQuestionId(null)
                }}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}

export const generateField = (type: SurveyFieldTypeEnum) => {
  const baseField = {
    id: crypto.randomUUID(),
    order: 0,
    type,
  }

  switch (type) {
    case SurveyFieldTypeEnum.TextQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
      }

    case SurveyFieldTypeEnum.MultipleChoiceQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
        choices: [],
        allowMultiple: false,
        allowOther: false,
        randomize: false,
      }

    case SurveyFieldTypeEnum.RatingQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        steps: 5,
        startAtOne: false,
      }

    case SurveyFieldTypeEnum.StatementField:
      return {
        ...baseField,
        text: '',
        buttonText: 'Continue',
        textSize: 'MEDIUM',
      }

    case SurveyFieldTypeEnum.RankingQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
        choices: [],
        randomize: false,
      }

    case SurveyFieldTypeEnum.MatrixQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
        rows: [],
        columns: [],
        allowMultiplePerRow: false,
      }

    case SurveyFieldTypeEnum.NumberQuestion:
      return {
        ...baseField,
        text: '',
        description: '',
        required: false,
        min: null,
        max: null,
        allowDecimals: false,
        unitLabel: '',
      }

    case SurveyFieldTypeEnum.Checkpoint:
      return {
        ...baseField,
        condition: '',
        target: {
          type: 'END',
          value: null,
        },
      }

    default:
      throw new Error(`Unsupported field type: ${type}`)
  }
}
