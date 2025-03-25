import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { cn } from "@/lib/utils"

interface QuestionBodyProps {
  mainElement?: React.ReactNode
  mainElementLabel?: string
  mainElementDescription?: string
  settingsElement?: React.ReactNode
  advancedSettingsElement?: React.ReactNode
  questionFormKey: string
  disabled?: boolean
}

export const QuestionBody = ({
  mainElement,
  mainElementLabel,
  mainElementDescription,
  settingsElement,
  advancedSettingsElement,
  questionFormKey,
  disabled,
}: QuestionBodyProps) => {
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      {mainElement ? (
        <div className="space-y-3">
          <div className="flex flex-col text-start">
            {mainElementLabel ? (
              <span className="text-sm font-semibold">{mainElementLabel}</span>
            ) : null}
            {mainElementDescription ? (
              <span className="text-[13px] text-gray-600">
                {mainElementDescription}
              </span>
            ) : null}
          </div>
          {mainElement}
        </div>
      ) : null}
      {settingsElement ? (
        <div className="space-y-5">{settingsElement}</div>
      ) : null}
      {advancedSettingsElement ? (
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
                <span className="sr-only">
                  {advancedSettingsOpen ? "Collapse" : "Expand"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4 p-0.5">
            {advancedSettingsElement}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}
