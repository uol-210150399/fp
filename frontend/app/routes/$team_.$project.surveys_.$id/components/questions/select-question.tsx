import { Fragment } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"

import {
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { QuestionBody } from "./question-body"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"


interface SelectQuestionProps {
  questionFormKey: string
}

export const SelectQuestion = ({
  questionFormKey,
}: SelectQuestionProps) => {
  const form = useFormContext()
  const optionsFieldArray = useFieldArray({
    control: form.control,
    name: `${questionFormKey}.choices`,
  })

  return (
    <QuestionBody
      mainElementLabel="Choices"
      mainElement={
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full space-y-3">
            {optionsFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-center ml-6 group/select-option relative">
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
                  onClick={() => {
                    optionsFieldArray.remove(index)
                  }}
                  disabled={
                    optionsFieldArray.fields.length === 1
                  }
                  variant="ghost"
                  className={cn(
                    "size-5 p-0 ml-2 transition-opacity opacity-0 group-hover/select-option:opacity-100 text-foreground-subtle hover:text-red-800",
                    optionsFieldArray.fields.length === 1 &&
                    "!opacity-0"
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
              onClick={() => {
                const length = optionsFieldArray.fields.length
                const value = {
                  id: crypto.randomUUID(),
                  text: `Choice ${length + 1}`,
                }
                optionsFieldArray.insert(length, value)
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
            name={`${questionFormKey}.allowMultiple`}
            defaultValue={true}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Multiple selection</FormLabel>
                  <FormDescription>
                    Allow respondents to select multiple options.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
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
            name={`${questionFormKey}.required`}
            defaultValue={true}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    Requires the respondent to select an option.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`${questionFormKey}.description`}
            defaultValue=""
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  This can be used to provide an example answer to the
                  respondents. The description appears below the question on the
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
