import { useState } from "react";
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { CREATE_PROJECT } from "@/lib/project.queries";
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
import { Input } from "@/components/ui/input";
import { ProjectResponse } from "@/backend.types";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

export function CreateProjectDialog({ open, onOpenChange, teamId }: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [createProject, { loading }] = useMutation<{ createProject: ProjectResponse }>(CREATE_PROJECT, {
    onCompleted: (data) => {
      if (data.createProject.error) {
        setError(data.createProject.error.message);
        toast.error(data.createProject.error.message);
        return;
      }
      toast.success("Project created successfully");
      onOpenChange(false);
      setName("");
      setError("");
    },
    refetchQueries: ['GetTeams']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    await createProject({
      variables: {
        input: {
          name,
          teamId
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 