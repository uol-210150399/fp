import { Draggable, Droppable } from "@hello-pangea/dnd"
import { memo } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Field, generateField } from "./field"
import { FieldTypeSelector } from "./field-selector"

type SectionFieldsProps = {
  disabled?: boolean
  sectionKey: string
}

export const SectionFields = memo(
  ({ disabled, sectionKey }: SectionFieldsProps) => {
    const questionsFieldArray = useFieldArray({
      name: `${sectionKey}.fields`,
    })
    const sectionId = useWatch({
      name: `${sectionKey}.id`,
    })
    const formContext = useFormContext()

    return (
      <div className="flex flex-col gap-2">
        <Droppable
          isDropDisabled={disabled}
          droppableId={sectionKey}
          type="field"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2"
            >
              {questionsFieldArray.fields.map((q, index) => {
                return (
                  <Draggable
                    isDragDisabled={disabled}
                    key={`${sectionKey}-${q.id}`}
                    draggableId={`${sectionKey}-${q.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Field
                        key={q.id}
                        fieldId={`${sectionKey}.fields.${index}`}
                        disabled={disabled}
                        isDragging={snapshot.isDragging}
                        sectionId={sectionId}
                        dragEnablerProps={provided}
                        onRemoveQuestion={() => {
                          const questions = formContext.getValues(
                            `${sectionKey}.fields`
                          )
                          const questionToRemove = questions[index]
                          if (!questionToRemove) return
                          questionsFieldArray.remove(index)
                        }}
                        onDuplicateQuestion={() => {
                          const questions = formContext.getValues(
                            `${sectionKey}.fields`
                          )
                          const currentQuestion = questions[index]
                          if (!currentQuestion) return
                          const newQuestion = {
                            ...currentQuestion,
                            id: crypto.randomUUID(),
                          }
                          questionsFieldArray.insert(index + 1, newQuestion)
                        }}
                      />
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {!disabled ? (
          <div className="flex justify-start">
            <FieldTypeSelector
              onSelect={q => {
                questionsFieldArray.append(generateField(q))
              }}
            />
          </div>
        ) : null}
      </div>
    )
  }
)
