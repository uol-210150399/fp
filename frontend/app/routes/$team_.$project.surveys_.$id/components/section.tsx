import { useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DraggableProvided } from "@hello-pangea/dnd"
import { Input } from "@/components/ui/input"
import { MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { SectionFields } from "./section-fields"

interface TopicProps {
  dragEnablerProps?: DraggableProvided
  index: number
  isDraggingOver?: boolean
  disabled?: boolean
  sectionKey: string
  onSectionAdd?: (section: any) => void
  onSectionDelete?: (sectionId: string) => void
  deletable?: boolean
}

const Section = ({
  deletable,
  dragEnablerProps,
  isDraggingOver,
  disabled,
  sectionKey,
  onSectionAdd,
  onSectionDelete,
}: TopicProps) => {
  const sectionId = useWatch({ name: `${sectionKey}.id` })

  return (
    <div
      ref={dragEnablerProps?.innerRef}
      {...dragEnablerProps?.draggableProps}
      {...dragEnablerProps?.dragHandleProps}
      className={cn(
        "group/topic flex flex-col gap-2 border rounded-md bg-background py-3 px-4 ",
        isDraggingOver &&
        "shadow-md border-blue-100 px-[13px] py-[9px] border-4"
      )}
    >
      <div className="cursor-default">
        <div className="flex flex-col gap-2 cursor-default">
          <div className="flex gap-1 items-center relative">
            <div className={cn(`flex items-center justify-between flex-1`)}>
              <div className="flex w-full gap-2 items-center">
                <FormField
                  name={`${sectionKey}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-0 text-left">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={disabled}
                          className="text-nowrap shadow-none px-0 py-0 border-none text-base text-zinc-900 min-w-5 font-semibold overflow-hidden cursor-text outline-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-0.5 items-center px-1 invisible group-hover/topic:visible">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="mt-2"
                  >
                    <DropdownMenuItem className="text-xs" onClick={onSectionAdd}>
                      <PlusIcon className="h-4 w-4 mr-2" size={14} />
                      Add section
                    </DropdownMenuItem>
                    {!disabled && (
                      <DropdownMenuItem
                        className="text-xs"
                        disabled={!deletable}
                        onClick={() => {
                          onSectionDelete?.(sectionId)
                        }}
                      >
                        <TrashIcon className="h-4 w-4 mr-2" size={14} />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <SectionFields disabled={disabled} sectionKey={sectionKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Section }
