import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateSurveyFormSections } from "./use-survey-mutations"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(z.any())
  }))
})

export type SurveyFormData = z.infer<typeof formSchema>

export function useSurveyForm(surveyId: string, initialData: SurveyFormData) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateSurveyFormSections] = useUpdateSurveyFormSections()

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SurveyFormData) => {
    try {
      setIsSubmitting(true)
      await updateSurveyFormSections({
        variables: {
          input: {
            surveyId,
            sections: data.sections.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description || "",
              fields: section.fields
            }))
          }
        }
      })
      toast.success("Changes saved successfully")
      form.reset(data)
    } catch (error) {
      toast.error("Failed to save changes")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit
  }
} 