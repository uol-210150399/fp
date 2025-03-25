import { useState } from "react";
import { useMutation } from "@apollo/client/react/hooks/useMutation.js";
import { UPDATE_SURVEY } from "@/lib/survey.queries";
import { GET_SURVEYS } from "@/hooks/use-surveys";
import { Survey } from "@/backend.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface RenameSurveyDialogProps {
  survey: Survey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameSurveyDialog({
  survey,
  open,
  onOpenChange,
}: RenameSurveyDialogProps) {
  const [title, setTitle] = useState(survey.title);
  const [description, setDescription] = useState(survey.description ?? "");

  const [updateSurvey, { loading }] = useMutation(UPDATE_SURVEY, {
    variables: {
      input: {
        id: survey.id,
        title: title.trim(),
        description: description.trim() || undefined,
      },
    },
    onCompleted: (data) => {
      if (data.updateSurvey.error) {
        toast.error("Error", {
          description: data.updateSurvey.error.message
        });
        return;
      }
      toast.success("Success", {
        description: "Survey updated successfully"
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message
      });
    },
    refetchQueries: [GET_SURVEYS]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    if (!title.trim()) {
      toast.error("Error", {
        description: "Title is required"
      });
      return;
    }

    try {
      updateSurvey();
    } catch (error) {
      console.error("Error updating survey:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Survey</DialogTitle>
          <DialogDescription>
            Update the title and description of your survey
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 