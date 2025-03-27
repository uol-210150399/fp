import { Fragment } from "react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { QuestionBody } from "./question-body"
import { Input } from "@/components/ui/input"

export const StatementQuestion = ({
  questionFormKey,
  disabled,
}: {
  questionFormKey: string
  disabled?: boolean
}) => {
  return (
    <QuestionBody
      settingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            defaultValue={"Continue"}
            name={`${questionFormKey}.buttonText`}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <div className="space-y-0.5">
                  <FormLabel>Button text</FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Acknowledge"
                    {...field}
                    value={field.value ?? "Continue"}
                  />
                </FormControl>
                <FormDescription>
                  The text displayed on the button that participants click to
                  continue (default is "Continue").
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            defaultValue={"large"}
            name={`${questionFormKey}.textSize`}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <div className="space-y-0.5">
                  <FormLabel>Font size</FormLabel>
                </div>
                <FormControl>
                  <ToggleGroup
                    variant="outline"
                    size="sm"
                    className="flex justify-start pb-1 gap-2 w-full"
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                    type="single"
                  >
                    <ToggleGroupItem value="SMALL" aria-label="Toggle small">
                      Small (0.6x)
                    </ToggleGroupItem>
                    <ToggleGroupItem value="MEDIUM" aria-label="Toggle medium">
                      Medium (0.8x)
                    </ToggleGroupItem>
                    <ToggleGroupItem value="LARGE" aria-label="Toggle large">
                      Large (Default)
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormDescription>
                  Set the font size for the statement question.
                </FormDescription>
              </FormItem>
            )}
          />
        </Fragment>
      }
    />
  )
}
