import { useState } from "react";
import { useMutation } from '@apollo/client/react/hooks/useMutation.js';
import { CREATE_TEAM } from "@/lib/team.queries";
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

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateTeamResponse {
  createTeam: {
    data: {
      id: string;
      name: string;
      slug: string;
    } | null;
    error: {
      message: string;
      code: string;
    } | null;
  }
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const [createTeam, { loading }] = useMutation<CreateTeamResponse>(CREATE_TEAM, {
    onCompleted: (data) => {
      if (data.createTeam.error) {
        setError("This URL is already taken. Please try another one.");
        toast.error("This URL is already taken. Please try another one.");
        return;
      }
      toast.success("Team created successfully");
      onOpenChange(false);
      setName("");
      setSlug("");
      setError("");
    },
    refetchQueries: ['GetTeams']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !slug.trim()) return;

    await createTeam({
      variables: {
        input: { name, slug }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Add a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Team name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Team URL"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/ /g, "-"))}
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim() || !slug.trim()}>
              {loading ? "Creating..." : "Create team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 