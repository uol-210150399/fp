import { Fragment } from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { QuestionBody } from "./question-body"

interface TextQuestionProps {
  disabled?: boolean
  fieldFormKey: string
}

export const TextQuestion = ({
  disabled,
  fieldFormKey,
}: TextQuestionProps) => {
  return (
    <QuestionBody
      disabled={disabled}
      settingsElement={
        <FormField
          disabled={disabled}
          name={`${fieldFormKey}.required`}
          defaultValue={true}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5 text-start">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Requires the respondent to answer the question.
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
      }
      advancedSettingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            name={`${fieldFormKey}.description`}
            defaultValue=""
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add description here"
                    className="placeholder:text-zinc-400"
                  />
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
          <FormField
            disabled={disabled}
            name={`${fieldFormKey}.instructions`}
            defaultValue=""
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add instructions here"
                    className="placeholder:text-zinc-400"
                  />
                </FormControl>
                <FormDescription>
                  The instructions guide scouting on how to get the best answer
                  from the respondent.
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
