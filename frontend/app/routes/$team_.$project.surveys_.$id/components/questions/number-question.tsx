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
import { QuestionBody } from "./question-body"

interface NumberQuestionProps {
  disabled?: boolean
  fieldFormKey: string
}
export const NumberQuestion = ({
  disabled,
  fieldFormKey,
}: NumberQuestionProps) => {
  const maxValue = useWatch({
    name: `${fieldFormKey}.max`,
    defaultValue: null,
  }) as number
  const minValue = useWatch({
    name: `${fieldFormKey}.min`,
    defaultValue: null,
  }) as number

  return (
    <QuestionBody
      disabled={disabled}
      settingsElement={
        <div className="flex gap-4">
          <FormField
            disabled={disabled}
            defaultValue={""}
            name={`${fieldFormKey}.min`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="space-y-0.5">
                  <FormLabel>Min number</FormLabel>
                </div>
                <FormControl>
                  <div className="flex items-center w-min">
                    <Input
                      disabled={field?.disabled}
                      className="w-24"
                      type="number"
                      placeholder="0-999+"
                      max={maxValue ? maxValue : undefined}
                      value={field.value}
                      onChange={(e) => {
                        const v = e.target.value
                        if ([null, undefined, ""].includes(v)) {
                          return field.onChange(null)
                        }
                        if (+v < 0) {
                          return field.onChange(0)
                        }
                        if (isNumber(maxValue) && +v > maxValue) {
                          return field.onChange(maxValue)
                        }
                        field.onChange(+v)
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            defaultValue={""}
            name={`${fieldFormKey}.max`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="space-y-0.5">
                  <FormLabel>Max number</FormLabel>
                </div>
                <FormControl>
                  <div className="flex items-center w-min">
                    <Input
                      disabled={field?.disabled}
                      className="w-24"
                      type="number"
                      placeholder="0-999+"
                      min={minValue ? minValue : undefined}
                      value={field.value}
                      onChange={(e) => {
                        const v = e.target.value
                        if ([null, undefined, ""].includes(v)) {
                          return field.onChange(null)
                        }
                        if (+v < 0) {
                          return field.onChange(0)
                        }
                        field.onChange(+v)
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            defaultValue={""}
            name={`${fieldFormKey}.unit`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="space-y-0.5">
                  <FormLabel>Unit</FormLabel>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. cm, kg"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
    />
  )
}


function isNumber(value: number | null): boolean {
  return typeof value === "number" && !isNaN(value)
}
