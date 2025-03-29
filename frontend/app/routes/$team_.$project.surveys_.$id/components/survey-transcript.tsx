import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitCommitIcon } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SurveyTranscriptProps {
  state: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyTranscript({ state, open, onOpenChange }: SurveyTranscriptProps) {
  const renderResponse = (field: any) => {
    switch (field.type) {
      case "Checkpoint":
        if (!field?.response) return null;

        const [result, ...reasoningParts] = field.response.split('. ')
        const reasoning = reasoningParts.join('. ')

        return (
          <Alert className="bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <GitCommitIcon className="h-4 w-4 mt-1" />
                <div className="space-y-1 flex-1">
                  <div className="font-medium">
                    Condition: {field.condition || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Then: {field.target?.type === "END" ? "End Survey" : `Skip to ${field.target === "SKIP_TO_QUESTION" ? "question" : "topic"}: ${field.target?.value}`}
                  </div>
                  <div className="text-sm">
                    {result || 'No evaluation result'}
                  </div>
                </div>
              </div>
              {reasoning && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-muted">
                    <AccordionTrigger className="text-xs text-muted-foreground hover:text-foreground py-2">
                      View evaluation details
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {reasoning}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </Alert>
        )

      case "MultipleChoiceQuestion":
        if (field.status === "Skipped") {
          return (
            <div className="space-y-2">
              <Badge variant="outline" className="text-muted-foreground">Skipped</Badge>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="reason" className="border-muted">
                  <AccordionTrigger className="text-xs text-muted-foreground hover:text-foreground py-2">
                    View skip reason
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {field.response}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )
        }
        return (
          <div className="space-y-1.5">
            {field.response?.selectedChoices?.map((choice: any) => (
              <div key={choice.id} className="text-foreground/60">
                • {choice.text}
              </div>
            ))}
          </div>
        )

      case "TextQuestion":
      default:
        if (field.status === "Skipped") {
          return (
            <div className="space-y-2">
              <Badge variant="outline" className="text-muted-foreground">Skipped</Badge>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="reason" className="border-muted">
                  <AccordionTrigger className="text-xs text-muted-foreground hover:text-foreground py-2">
                    View skip reason
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {field.response}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )
        }
        return <div className="text-foreground/60">{field.response}</div>
    }
  }

  const shouldShowField = (field: any) => {
    // Don't filter out checkpoints
    if (field.type === "Checkpoint") return true

    // Filter out questions skipped due to survey end
    if (field.response === "Skipped due to survey end condition") return false

    // Filter out skipped follow-up questions
    if (field.isFollowup && field.status === "Skipped") return false

    return field.isQuestion
  }

  // Add this function to filter topics
  const hasVisibleFields = (topic: any) => {
    return topic.fields.some(shouldShowField)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Survey Transcript</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-6">
          <div className="space-y-8">
            {state?.topics
              ?.filter(hasVisibleFields) // Filter out topics with no visible fields
              .map((topic: any) => (
                <div key={topic.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{topic.title}</h3>
                  <div className="space-y-6">
                    {topic.fields
                      .filter(shouldShowField)
                      .map((field: any) => (
                        <div key={field.id} className="space-y-2">
                          {field.type === "Checkpoint" ? (
                            renderResponse(field)
                          ) : (
                            <>
                              <div className="space-y-1">
                                <p className="font-medium">{field.text}</p>
                                {field.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {field.description}
                                  </p>
                                )}
                              </div>
                              <div>
                                {renderResponse(field)}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 