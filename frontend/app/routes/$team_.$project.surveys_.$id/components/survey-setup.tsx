import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useUpdateSurvey } from "@/hooks/use-survey-mutations"
import { useParams } from "@remix-run/react"
import React from "react"
import { useSurvey } from "@/hooks/use-surveys"

const FormSchema = z.object({
  title: z.string().min(1, "Survey name is required"),
  context: z.string(),
  welcomeMessage: z.string(),
  features: z.object({
    showProgressBar: z.boolean().default(true),
  })
})

export type SurveySetupData = z.infer<typeof FormSchema>

interface SurveySetupProps {
  disabled?: boolean
}

export function SurveySetup({
  disabled,
}: SurveySetupProps) {
  const { id } = useParams();
  const { survey } = useSurvey(id!);
  const [updateSurvey, { loading: isUpdating }] = useUpdateSurvey();

  const form = useForm<SurveySetupData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: survey?.title ?? "",
      context: survey?.form?.context ?? "",
      welcomeMessage: survey?.welcomeMessage ?? "",
      features: {
        showProgressBar: true,
      }
    },
  })

  // Reset form when survey data changes
  React.useEffect(() => {
    if (survey) {
      form.reset({
        title: survey.title,
        context: survey.form?.context ?? "",
        welcomeMessage: survey.welcomeMessage ?? "",
        features: {
          showProgressBar: true,
        }
      });
    }
  }, [survey, form]);

  const hasUnsavedChanges = form.formState.isDirty

  const handleSubmit = async (data: SurveySetupData) => {
    try {
      await updateSurvey({
        variables: {
          input: {
            id,
            title: data.title,
            context: data.context,
            welcomeMessage: data.welcomeMessage,
          }
        }
      });
      form.reset(data);
    } catch (error) {
      console.error("Failed to update survey settings:", error)
      toast.error("Failed to update survey settings")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-2 px-0.5">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter survey name"
                      {...field}
                      disabled={disabled || isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey Context</FormLabel>
                  <FormDescription>
                    Provide context about the domain this survey is conducted in to guide the <b>scouti</b>
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Enter survey context"
                      className="min-h-[100px]"
                      {...field}
                      disabled={disabled || isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormDescription>
                    This message will be shown to respondents at the start of the survey
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Enter welcome message"
                      className="min-h-[100px]"
                      {...field}
                      disabled={disabled || isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* 
          <Separator />

          <div className="space-y-4">

            <FormField
              control={form.control}
              name="features.showProgressBar"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center px-3 py-4 border rounded-md">
                  <div className="flex flex-col gap-1">
                    <FormLabel className="mt-0">Show Progress Bar</FormLabel>
                    <FormDescription>
                      Display progress bar to show completion status
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled || isUpdating}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

          </div> */}
        </div>

        {!disabled && hasUnsavedChanges && (
          <div className="w-full bg-background border-t flex items-center justify-end rounded-b-lg">
            <div className="flex items-center gap-8 pt-3">
              <p className="font-medium text-sm">You have unsaved changes</p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isUpdating}
                  onClick={() => form.reset()}
                >
                  Discard changes
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
} 