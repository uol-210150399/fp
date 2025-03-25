import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Section } from "./section"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Form } from "@/components/ui/form"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

// Mock data for initial form state
const mockFormData = {
  sections: [
    {
      id: "1",
      title: "Basic Information",
      description: "Please provide your basic information",
      fields: [
        {
          id: "q1",
          type: "TextQuestion",
          text: "What is your name?",
          description: "Please enter your full name",
          required: true,
          order: 1
        },
        {
          id: "q2",
          type: "TextQuestion",
          text: "What is your role?",
          description: "Your current job title",
          required: true,
          order: 2
        }
      ]
    },
    {
      id: "2",
      title: "Experience",
      description: "Tell us about your experience",
      fields: [
        {
          id: "q3",
          type: "TextQuestion",
          text: "How many years of experience do you have?",
          description: "Describe your relevant experience",
          required: true,
          order: 1
        }
      ]
    }
  ]
}

const formSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(z.any())
  }))
})

type FormData = z.infer<typeof formSchema>

export function SurveyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: mockFormData,
  })

  // Log form changes - will be replaced with API call later
  const onSubmit = (data: FormData) => {
    console.log('Form data:', data)
  }

  const sectionsFieldArray = useFieldArray({
    control: form.control,
    name: "sections",
  })

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination) return

    if (type === "topic") {
      if (source.droppableId === "dnd-sections") {
        const sections = form.getValues("sections")
        const s = sections?.[source.index]
        const newSection = {
          ...s,
          title: s?.title ?? "",
          fields: s?.fields?.length ? s.fields : [],
          id: crypto.randomUUID(),
        }
        sections.splice(destination.index, 0, newSection)
        form.setValue("sections", sections)
      } else {
        const sections = form.getValues("sections")
        const [movedSection] = sections.splice(source.index, 1)
        sections.splice(destination.index, 0, movedSection)
        form.setValue("sections", sections)
      }
    } else if (type === "field") {
      if (source.droppableId.includes("dnd-")) {
        const destTopicKey = destination.droppableId as `sections.${number}`
        const questions = form.getValues(`${destTopicKey}.fields`)
        const sourceTopic = form.getValues(destTopicKey)
        const newQuestion = {
          ...(sourceTopic?.fields[source.index]),
          id: crypto.randomUUID(),
        }
        questions.splice(destination.index, 0, newQuestion)
        form.setValue(`${destTopicKey}.fields`, questions)
      } else {
        const sourceTopicKey = `${source.droppableId}` as `sections.${number}`
        const destTopicKey = `${destination.droppableId}` as `sections.${number}`

        const sourceQuestions = [
          ...form.getValues(`${sourceTopicKey}.fields`),
        ]
        const destQuestions = [
          ...form.getValues(`${destTopicKey}.fields`),
        ]

        const [movedQuestion] = sourceQuestions.splice(source.index, 1)

        if (sourceTopicKey === destTopicKey) {
          sourceQuestions.splice(destination.index, 0, movedQuestion)
          form.setValue(`${sourceTopicKey}.fields`, sourceQuestions)
        } else {
          destQuestions.splice(destination.index, 0, movedQuestion)
          form.setValue(`${sourceTopicKey}.fields`, sourceQuestions)
          form.setValue(`${destTopicKey}.fields`, destQuestions)
        }
      }
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
          <div className="flex flex-col gap-3">
            <Droppable droppableId="topics" type="topic">
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn("flex flex-col space-y-8 w-full ")}
                  >
                    {sectionsFieldArray.fields.map((sectionField, index) => {
                      const sectionKey = `sections.${index}` as `sections.${number}`

                      return (
                        <Draggable
                          draggableId={sectionField.id}
                          key={sectionField.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                            >
                              <Section
                                sectionKey={sectionKey}
                                key={sectionField.id}
                                isDraggingOver={snapshot.isDragging}
                                dragEnablerProps={provided}
                                onSectionAdd={(section) => {
                                  sectionsFieldArray.insert(index + 1, section)
                                }}
                                onSectionDelete={(sectionId) => {
                                  sectionsFieldArray.remove(index)
                                }}
                                deletable={sectionsFieldArray.fields.length > 1}
                                index={index}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )
              }}
            </Droppable>
            <Button
              size="icon"
              variant={"secondary"}
              className="self-center"
              onClick={() => {
                sectionsFieldArray.insert(sectionsFieldArray.fields.length, {
                  id: crypto.randomUUID(),
                  title: `Section ${sectionsFieldArray.fields.length + 1}`,
                  fields: []
                })
              }}
            >
              <Plus size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </DragDropContext>
  )
} 