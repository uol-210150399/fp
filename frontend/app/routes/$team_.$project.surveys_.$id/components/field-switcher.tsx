import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SurveyFieldTypeEnum } from "@/backend.types"
import { FileDigitIcon, FileTextIcon, ListIcon, ListOrderedIcon, RouteIcon, StarIcon, TableIcon, TextIcon } from "lucide-react"

const QUESTIONS_SELECTOR_OPTIONS = {
  [SurveyFieldTypeEnum.TextQuestion]: {
    label: "Text",
    icon: <TextIcon />,
  },
  [SurveyFieldTypeEnum.NumberQuestion]: {
    label: "Number",
    icon: <FileDigitIcon />,
  },
  [SurveyFieldTypeEnum.MultipleChoiceQuestion]: {
    label: "Multiple choice",
    icon: <ListIcon />,
  },
  [SurveyFieldTypeEnum.RankingQuestion]: {
    label: "Ranking",
    icon: <ListOrderedIcon />,
  },
  [SurveyFieldTypeEnum.RatingQuestion]: {
    label: "Rating",
    icon: <StarIcon />,
  },
  [SurveyFieldTypeEnum.MatrixQuestion]: {
    label: "Matrix",
    icon: <TableIcon />,
  },
  [SurveyFieldTypeEnum.StatementField]: {
    label: "Statement",
    icon: <FileTextIcon />,
  },
  [SurveyFieldTypeEnum.Checkpoint]: {
    label: "Checkpoint",
    icon: <RouteIcon />,
  },
}

type QuestionTypeSwitcherProps = {
  disabled?: boolean
  selectedType: SurveyFieldTypeEnum
  onSelect?: (q: SurveyFieldTypeEnum) => void
}

export const QuestionTypeSwitcher = ({
  disabled,
  selectedType,
  onSelect,
}: QuestionTypeSwitcherProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleSelect = (q: SurveyFieldTypeEnum) => {
    onSelect?.(q)
    setPopoverOpen(false)
  }

  const selectedOption = QUESTIONS_SELECTOR_OPTIONS[selectedType] || {
    label: "Unknown",
    icon: null,
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger disabled={disabled}>
        <Button
          variant="outline"
          className="border-none px-1.5 bg-zinc-50 hover:bg-zinc-100 gap-2 text-zinc-600 text-xs"
          size="sm"
          disabled={disabled}
        >
          {selectedOption.icon}
          {selectedOption.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[18rem] p-0">
        <Command>
          <CommandInput
            placeholder="Search for a field type"
            className="h-11"
          />
          <CommandList>
            <CommandGroup>
              {Object.entries(QUESTIONS_SELECTOR_OPTIONS).map(([key, { icon: Icon, label }]) => (
                <CommandItem
                  key={key}
                  onSelect={() => handleSelect(key as SurveyFieldTypeEnum)}
                  className="hover:cursor-pointer"
                >
                  {Icon}
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
