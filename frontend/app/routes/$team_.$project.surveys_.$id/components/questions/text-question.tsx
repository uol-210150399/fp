import { Fragment, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface TextQuestionProps {
  fieldPath: string  // e.g. "sections.0.fields.0"
  control: any // form control from parent
}

export const TextQuestion = ({ fieldPath, control }: TextQuestionProps) => {
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* Main Question Display */}
      <div className="space-y-3">
        <div className="flex flex-col text-start">
          <span className="text-sm font-semibold">Text Question</span>
          <span className="text-[13px] text-gray-600">
            Configure your text question
          </span>
        </div>

        {/* Question Text */}
        <FormField
          control={control}
          name={`${fieldPath}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your question" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Type your answer here..."
            className="min-h-[100px] resize-none bg-background"
            disabled
          />
        </div>
      </div>

      {/* Basic Settings */}
      <div className="space-y-5">
        <FormField
          control={control}
          name={`${fieldPath}.required`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5 text-start">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Requires the respondent to answer this question
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
      </div>

      {/* Advanced Settings */}
      <Collapsible
        open={advancedSettingsOpen}
        onOpenChange={setAdvancedSettingsOpen}
        className="space-y-3"
      >
        <div className="flex items-center">
          <CollapsibleTrigger>
            <Button
              type="button"
              variant="link"
              className={cn(
                "rounded text-zinc-600 !no-underline font-medium text-sm px-3",
                advancedSettingsOpen && "bg-zinc-100"
              )}
            >
              Advanced settings
              {advancedSettingsOpen ? (
                <ChevronUpIcon className="ml-1.5 size-4" />
              ) : (
                <ChevronDownIcon className="ml-1.5 size-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4 p-0.5">
          <FormField
            control={control}
            name={`${fieldPath}.description`}
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add description here..."
                  />
                </FormControl>
                <FormDescription>
                  Additional context or instructions for the respondent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 