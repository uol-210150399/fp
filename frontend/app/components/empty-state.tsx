import { Button } from "@/components/ui/button";
import { FolderPlusIcon, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center">
        <FolderPlusIcon className="mx-auto size-10 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">No projects</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new project.
        </p>
        <div className="mt-6">
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
} 