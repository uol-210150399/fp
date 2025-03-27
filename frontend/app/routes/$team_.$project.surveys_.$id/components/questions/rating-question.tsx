import { Fragment } from "react"
import { useWatch } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { QuestionBody } from "./question-body"

interface RatingScaleQuestionProps {
  disabled?: boolean
  fieldFormKey: string
}

export const RatingScaleQuestion = ({
  disabled,
  fieldFormKey,
}: RatingScaleQuestionProps) => {
  const steps = useWatch({ name: `${fieldFormKey}.steps` }) as number
  const labels = useWatch({ name: `${fieldFormKey}.labels` }) as string[]

  function handleKeyDownRangeInput(e: React.KeyboardEvent<HTMLInputElement>) {
    // eslint-disable-next-line no-useless-escape
    if (/^[\+\-.,eE]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <QuestionBody
      disabled={disabled}
      mainElement={
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              `grid gap-1 select-none grid-cols-[repeat(auto-fit,minmax(1rem,1fr))] w-full`
            )}
            role="radiogroup"
          >
            {new Array(steps).fill(0).map((_, index) => (
              <div
                role="radio"
                aria-checked="false"
                aria-roledescription="radio"
                key={index}
                className="font-medium select-none items-center flex justify-center border bg-accent-subtle hover:bg-accent cursor-pointer transition rounded-sm h-14"
              >
                <p>{index + 1}</p>
              </div>
            ))}
          </div>
          {labels?.length ? (
            <div className="flex justify-between">
              {labels.map((label, index) => (
                <p className="text-sm font-medium" key={index}>
                  {label}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      }
      settingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            name={`${fieldFormKey}.steps`}
            defaultValue={5}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Steps</FormLabel>
                </div>
                <FormControl>
                  <Input
                    disabled={field?.disabled}
                    className="w-16"
                    type="number"
                    min={2}
                    max={10}
                    step={1}
                    value={field.value}
                    onChange={(e) => {
                      const v = Math.floor(Number(e.target.value) || 1)
                      if (v < 1 || v > 10) return
                      field.onChange(v)
                    }}
                    onKeyDown={handleKeyDownRangeInput}
                  />
                </FormControl>
                <FormDescription>
                  Set the number of steps in the rating scale (1-10)
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            defaultValue={""}
            name={`${fieldFormKey}.labels`}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <div className="space-y-0.5 ">
                  <FormLabel>Labels</FormLabel>
                </div>
                <FormControl>
                  <Input
                    disabled={field?.disabled}
                    placeholder="Poor, Great"
                    value={field.value?.join?.(",")}
                    onChange={(e) => field.onChange(e.target.value.split(","))}
                  />
                </FormControl>
                <FormDescription>
                  Add comma separated labels for the rating scale
                </FormDescription>
              </FormItem>
            )}
          />
        </Fragment>
      }
      advancedSettingsElement={
        <FormField
          disabled={disabled}
          name={`${fieldFormKey}.required`}
          defaultValue={true}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5 text-start">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Requires the respondent to select a rating.
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
    />
  )
}
