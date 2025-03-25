import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Copy, Trash, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Survey } from "@/backend.types";
import { RenameSurveyDialog } from "./rename-survey-dialog";
import { DeleteSurveyDialog } from "./delete-survey-dialog";

interface SurveyActionsProps {
  survey: Survey;
}

export function SurveyActions({ survey }: SurveyActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const copySurveyKey = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(survey.key);
    toast.success("Survey key copied to clipboard");
  };
  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setDeleteOpen(true);
  };

  return (
    <div onClick={(e) => e.preventDefault()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="z-20 ml-auto h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Survey actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRename}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copySurveyKey}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Survey Key
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameSurveyDialog
        survey={survey}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteSurveyDialog
        survey={survey}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
} 