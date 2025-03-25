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
import { FileDigitIcon, FileTextIcon, ListIcon, ListOrderedIcon, Plus, RouteIcon, StarIcon, TableIcon, TextIcon } from "lucide-react"
import { SurveyFieldTypeEnum } from "@/backend.types"

type QuestionTypeSelectorProps = {
  onSelect?: (q: any) => void
}

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

export const FieldTypeSelector = ({
  onSelect,
}: QuestionTypeSelectorProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleSelect = (type: SurveyFieldTypeEnum) => {
    onSelect?.(type)
    setPopoverOpen(false)
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <Button variant="secondary" size="sm" className="h-8 gap-2">
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[18rem] p-0">
        <Command>
          <CommandInput
            placeholder="Search for a question or checkpoint type"
            className="h-11"
          />
          <CommandList>
            <CommandGroup heading="Questions">
              {Object.entries(QUESTIONS_SELECTOR_OPTIONS).map(([key, { icon: Icon, ...q }]) => (
                <CommandItem
                  key={key}
                  onSelect={() => {
                    handleSelect(key as SurveyFieldTypeEnum)
                    setPopoverOpen(false)
                  }}
                  className="hover:cursor-pointer"
                >
                  {Icon}
                  {q.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

