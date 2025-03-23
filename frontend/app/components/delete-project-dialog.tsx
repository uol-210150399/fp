import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@/backend.types";
import { DELETE_PROJECT } from "@/lib/project.queries";

interface DeleteProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({ project, open, onOpenChange }: DeleteProjectDialogProps) {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    onCompleted: (data) => {
      if (data.deleteProject.error) {
        toast.error(data.deleteProject.error.message);
        return;
      }
      toast.success("Project deleted successfully");
      onOpenChange(false);
    },
    refetchQueries: ['GetTeams']
  });

  const handleDelete = async () => {
    await deleteProject({
      variables: {
        input: {
          id: project.id
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 