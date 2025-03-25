import { Button } from "@/components/ui/button";
import { FolderPlusIcon, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onCreateClick: () => void;
}

export function EmptyState({ title, description, buttonText, onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center">
        <FolderPlusIcon className="mx-auto size-10 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="mt-6">
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
} 