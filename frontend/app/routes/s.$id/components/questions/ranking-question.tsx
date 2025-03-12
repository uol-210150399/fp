import { QuestionSkeleton } from "./question-skeleton";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface RankingOption {
  id: string;
  label: string;
  rank?: number
}

interface RankingQuestionProps {
  title: string;
  description?: string;
  required?: boolean;
  options: RankingOption[];
  onSubmit?: (rankedOptions: RankingOption[]) => void;
}

const DropdownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    className="fill-current"
  >
    <path
      d="M3.293 8.293a1 1 0 0 1 1.414 0L12 15.586l7.293-7.293a1 1 0 1 1 1.414 1.414L13.414 17a2 2 0 0 1-2.828 0L3.293 9.707a1 1 0 0 1 0-1.414"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const DragIcon = () => (
  <svg height="14" viewBox="0 0 10 14" width="10" className="fill-current">
    <g>
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="2" cy="7" r="1.5" />
      <circle cx="2" cy="12" r="1.5" />
      <circle cx="8" cy="2" r="1.5" />
      <circle cx="8" cy="7" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
    </g>
  </svg>
);

const SortableItem = ({ option, openDropdown, setOpenDropdown }: {
  option: RankingOption;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
}) => {
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
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        max-w-[173px] flex items-center justify-between
        bg-[rgba(1,66,172,0.1)] shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset]
        py-1.5 px-2 pr-3 rounded cursor-grab select-none text-xl
        transition-[background-color] duration-100 ease-out
        hover:bg-[rgba(1,66,172,0.3)]
        max-[600px]:text-base max-[600px]:max-w-[168px]
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="relative flex items-center justify-center px-2 py-1 cursor-default 
            bg-white border border-[rgba(1,66,172,0.6)] rounded-sm fill-[#0142AC] gap-2"
          onClick={() => setOpenDropdown(openDropdown === option.id ? null : option.id)}
        >
          <div className="text-xs">{option.rank || '-'}</div>
          <DropdownIcon />
          {openDropdown === option.id && (
            <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full 
              bg-white shadow-[0_0_0_1px_rgba(1,66,172,0.6)_inset] text-xs leading-4 z-10">
              {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  className="w-full p-2 flex items-center justify-center hover:bg-[rgba(1,66,172,0.3)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle rank selection
                    setOpenDropdown(null);
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
        <p>{option.label}</p>
      </div>
      <div {...attributes} {...listeners} className="text-[#0142AC]">
        <DragIcon />
      </div>
    </li>
  );
};

export const RankingQuestion: React.FC<RankingQuestionProps> = ({
  title,
  description,
  required,
  options,
  onSubmit,
}) => {
  const [items, setItems] = useState(options);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        return newItems;
      });
      setShowClear(true);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(items);
    }
  };

  const handleClear = () => {
    setItems(options);
    setShowClear(false);
  };

  return (
    <QuestionSkeleton
      elements={{
        title: title,
        description: description,
      }}
      required={required}
    >
      <div className="text-[#0142AC] mt-8">
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
            <ul className="flex flex-col gap-2">
              {items.map((option) => (
                <SortableItem
                  key={option.id}
                  option={option}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        {showClear && (
          <p
            className="text-base mt-4 underline cursor-pointer max-[600px]:text-sm"
            onClick={handleClear}
          >
            Clear all
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3 max-[600px]:fixed max-[600px]:z-10 max-[600px]:left-0 max-[600px]:bottom-0 max-[600px]:w-full max-[600px]:px-4">
        <button
          onClick={handleSubmit}
          className="font-bold cursor-pointer bg-[#0142AC] text-white outline-none 
            shadow-[0_3px_12px_0_rgba(0,0,0,0.1)] px-[14px] rounded h-10 text-xl 
            uppercase transition-colors duration-100 hover:bg-[#275EB8] max-[600px]:w-full"
        >
          OK
        </button>
        <p className="text-xs leading-4 max-[600px]:hidden">
          press <strong className="tracking-[0.2px]">Enter ↵</strong>
        </p>
      </div>
    </QuestionSkeleton>
  );
};