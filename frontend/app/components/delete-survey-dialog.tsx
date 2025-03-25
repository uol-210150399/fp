import { useMutation } from "@apollo/client/react/hooks/useMutation.js";
import { DELETE_SURVEY } from "@/lib/survey.queries";
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
import { toast } from "sonner";

interface DeleteSurveyDialogProps {
  survey: Survey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSurveyDialog({
  survey,
  open,
  onOpenChange,
}: DeleteSurveyDialogProps) {
  const [deleteSurvey, { loading }] = useMutation(DELETE_SURVEY, {
    onCompleted: (data) => {
      if (data.deleteSurvey.error) {
        toast.error("Error", {
          description: data.deleteSurvey.error.message
        });
        return;
      }
      toast.success("Success", {
        description: "Survey deleted successfully"
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message
      });
    },
  });

  const handleDelete = async () => {
    await deleteSurvey({
      variables: {
        id: survey.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Survey</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this survey? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
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