import { useForm, useFormContext, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useState } from "react"
import { SurveyFieldTypeEnum, TargetType } from "@/backend.types"

export interface CheckpointTarget {
  type: TargetType;
  value?: string;
}

export interface Checkpoint {
  id: string;
  condition: string;
  target: CheckpointTarget;
  type: string;
  order: number;
}

// Schema for form validation
const checkpointSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  condition: z.string().min(1, "Condition is required"),
  target: z.object({
    type: z.nativeEnum(TargetType),
    value: z.string().optional(),
  }).refine(
    (data) => {
      if (data.type === TargetType.SKIP_TO_SECTION ||
        data.type === TargetType.SKIP_TO_QUESTION) {
        return !!data.value?.trim();
      }
      return true;
    },
    {
      message: "Target value is required for this target type",
      path: ["value"],
    }
  ),
  type: z.string().default("CHECKPOINT"),
  order: z.number().default(0),
})

// Action type options for dropdown
const targetTypeOptions = [
  { value: TargetType.SKIP_TO_SECTION, label: "Skip to Section" },
  { value: TargetType.SKIP_TO_QUESTION, label: "Skip to Question" },
  { value: TargetType.END, label: "End Survey" },
]

interface CheckpointProps {
  disabled?: boolean
  fieldFormKey: string
  onCancel?: () => void
}

export const Checkpoint = ({
  disabled = false,
  fieldFormKey,
  onCancel,
}: CheckpointProps) => {
  const field = useWatch({ name: fieldFormKey })
  const formContext = useFormContext()

  // Parse the existing checkpoint data
  const parsedCheckpoint = checkpointSchema.safeParse(field || {})

  // Setup form with default values
  const form = useForm({
    resolver: zodResolver(checkpointSchema),
    defaultValues: parsedCheckpoint.success ? parsedCheckpoint.data : {
      id: crypto.randomUUID(),
      condition: "",
      target: {
        type: TargetType.END,
        value: "",
      },
      type: SurveyFieldTypeEnum.Checkpoint,
    },
  })

  const handleCancel = () => {
    setError(null)
    onCancel?.()
    form.reset()
  }

  // Get available sections and fields for selection
  const sections = useWatch({ name: "sections" }) || []
  const sectionKey = extractSectionKey(fieldFormKey)
  const sectionIndex = parseInt(sectionKey.split(".").pop() || "0")

  const [error, setError] = useState<string | null>(null)
  // Handle form submission
  const onSubmit = () => {
    setError(null)
    // validate the form
    const isValid = form.trigger()
    if (!isValid) {
      setError("Please fill in all required fields")
      return
    }

    const data = form.getValues()
    if (!data.target.value && data.target.type !== TargetType.END) {
      setError("Target value is required")
      return
    }

    const condition = formContext.getValues(`${fieldFormKey}.condition`)
    formContext.setValue(fieldFormKey, {
      ...data,
      condition,
    }, {
      shouldValidate: true,
      shouldDirty: true,
    })
    onCancel?.()
  }

  // Get the selected target type
  const targetType = form.watch("target.type")

  // Get available sections and fields for selection
  const availableSections = getAvailableSections(sections, sectionIndex)
  const availableFields = getAvailableFields(sections, field?.id)

  return (
    <div className="flex flex-col gap-4 text-left">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => { })} className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            {/* Target type selection */}
            <FormField
              control={form.control}
              name="target.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Type</FormLabel>
                  <Select
                    disabled={disabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targetTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select what should happen when the condition is met
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target value input based on selected target type */}
            {targetType !== TargetType.END && (
              <FormField
                control={form.control}
                name="target.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {targetType === TargetType.SKIP_TO_SECTION
                        ? "Section"
                        : "Field"}
                    </FormLabel>
                    <FormControl>
                      {targetType === TargetType.SKIP_TO_SECTION ? (
                        <Select
                          disabled={disabled}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSections.map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          disabled={disabled}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a field" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableFields.map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
            >
              Save
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </Form>
    </div>
  )
}

// Helper function to extract section key from field form key
function extractSectionKey(fieldFormKey: string) {
  return fieldFormKey.split(".").slice(0, -2).join(".")
}

// Helper function to get available sections for selection
function getAvailableSections(sections: any[], currentSectionIndex: number) {
  // Return sections that come after the current section
  return sections.slice(currentSectionIndex + 1).map(section => ({
    id: section.id,
    name: section.title
  }))
}

// Helper function to get available fields for selection
function getAvailableFields(sections: any[], currentFieldId: string) {
  // Flatten all fields from all sections, excluding checkpoints
  const allFields = sections.flatMap(section =>
    (section.fields || [])
      .map((f: any) => ({
        id: f.id,
        text: f.text || f.condition,
        type: f.type
      }))
  ).filter((f: any) => {
    if (f.type === SurveyFieldTypeEnum.Checkpoint && f.id !== currentFieldId) {
      return false
    }
    return true
  })
  // Find the index of the current field
  const currentIndex = allFields.findIndex(f => f.id === currentFieldId)
  if (currentIndex === -1) {
    return []
  }

  // Return fields that come after the current field
  return allFields.slice(currentIndex + 1)
}