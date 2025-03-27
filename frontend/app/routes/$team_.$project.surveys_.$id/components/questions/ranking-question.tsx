import { Fragment } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuestionBody } from "./question-body"

interface RankingQuestionProps {
  disabled?: boolean
  questionFormKey: string
}

export const RankingQuestion = ({
  disabled,
  questionFormKey,
}: RankingQuestionProps) => {
  const form = useFormContext()
  const choicesFieldArray = useFieldArray({
    control: form.control,
    name: `${questionFormKey}.choices`,
  })

  return (
    <QuestionBody
      mainElementLabel="Choices"
      mainElementDescription="A list of choices to be displayed for respondents to rank in their preferred order."
      mainElement={
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full space-y-3">
            {choicesFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center ml-6 group/ranking-option relative">
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Choice"
                      {...form.register(`${questionFormKey}.choices.${index}.text`)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <Button
                  type="button"
                  disabled={disabled || choicesFieldArray.fields.length === 1}
                  onClick={() => {
                    choicesFieldArray.remove(index)
                  }}
                  variant="ghost"
                  className={cn(
                    "size-5 p-0 ml-2 transition-opacity opacity-0 group-hover/ranking-option:opacity-100 text-foreground-subtle hover:text-red-800",
                    choicesFieldArray.fields.length === 1 && "!opacity-0"
                  )}
                >
                  <span className="sr-only">Remove option</span>
                  <XIcon className="size-5" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-end mr-7">
            <Button
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => {
                const length = choicesFieldArray.fields.length
                const value = {
                  id: crypto.randomUUID(),
                  text: `Choice ${length + 1}`,
                }
                choicesFieldArray.insert(length, value)
              }}
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      }
      settingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            name={`${questionFormKey}.randomize`}
            defaultValue={false}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Randomize choices</FormLabel>
                  <FormDescription>
                    Randomize the order of choices for each respondent
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={field?.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Fragment>
      }
      advancedSettingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            name={`${questionFormKey}.required`}
            defaultValue={true}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    Requires the respondent to rank all choices.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={field?.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            name={`${questionFormKey}.description`}
            defaultValue=""
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Additional information that appears below the question on the
                  respondent's screen.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fragment>
      }
    />
  )
}
