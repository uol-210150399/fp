import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

interface SurveyUrlDialogProps {
  surveyKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyUrlDialog({ surveyKey, open, onOpenChange }: SurveyUrlDialogProps) {
  const surveyUrl = `${window.location.origin}/s/${surveyKey}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      toast.success("Survey link copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Survey URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Share this URL with respondents</Label>
            <div className="flex items-center gap-2">
              <Input value={surveyUrl} readOnly />
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 