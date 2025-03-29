import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Button } from "@/components/ui/button"
import { GripVertical, ChevronDown } from "lucide-react";

interface RankingOption {
  id: string;
  label: string;
}

interface RankingQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  options: RankingOption[];
  onSubmit?: (rankedOptions: RankingOption[]) => void;
}

const SortableItem = ({ option, index }: { option: RankingOption; index: number }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center justify-between
        bg-[rgba(1,66,172,0.1)] shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset]
        py-1.5 px-2 pr-3 rounded cursor-grab select-none text-xl
        transition-[background-color] duration-100 ease-out
        hover:bg-[rgba(1,66,172,0.3)]
        ${isDragging ? 'opacity-50' : ''}
        max-[600px]:text-base
      `}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center px-2 py-1 
          bg-white border border-[rgba(1,66,172,0.6)] rounded-sm text-xs">
          {index + 1}
        </div>
        <p>{option.label}</p>
      </div>
      <div {...attributes} {...listeners} className="text-primary cursor-grab">
        <GripVertical className="h-4 w-4" />
      </div>
    </li>
  );
};

export const RankingQuestion: React.FC<RankingQuestionProps> = ({
  title,
  description,
  required = false,
  options,
  onSubmit,
}) => {
  const [items, setItems] = useState(options);
  const [error, setError] = useState<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        const draggableElement = args.context.active?.data.current?.sortable.node;
        if (!draggableElement) return undefined;

        const row = draggableElement.getBoundingClientRect();
        return {
          x: row.left,
          y: row.top + (event.code === 'ArrowDown' ? 1 : -1) * row.height,
        };
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        setHasChanged(true);
        if (error) setError(null);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    if (required && !hasChanged) {
      setError("Please rank the options");
      return;
    }

    if (onSubmit) {
      onSubmit(items);
    }
  };

  const handleReset = () => {
    setItems(options);
    setHasChanged(false);
    if (error) setError(null);
  };

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
      error={error}
    >
      <div className="text-primary">
        <p className="mb-4 leading-6 max-[600px]:text-sm max-[600px]:leading-5">
          Drag and drop to rank options
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2 max-w-md" role="list">
              {items.map((option, index) => (
                <SortableItem
                  key={option.id}
                  option={option}
                  index={index}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {hasChanged && (
          <button
            onClick={handleReset}
            className="text-base mt-4 underline cursor-pointer max-[600px]:text-sm"
          >
            Reset order
          </button>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={required && !hasChanged}
          >
            Submit
          </Button>
        </div>
      </div>
    </QuestionSkeleton>
  );
};