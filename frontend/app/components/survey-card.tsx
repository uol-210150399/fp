import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Survey } from "@/backend.types";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, MoreHorizontal } from "lucide-react";
import { Link } from "@remix-run/react";
import { SurveyActions } from "./survey-actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface SurveyCardProps {
  survey: Survey;
  teamSlug: string;
  projectId: string;
}

export function SurveyCard({ survey, teamSlug, projectId }: SurveyCardProps) {
  const { user } = useUser();

  return (
    <Card className="group shadow-none relative flex min-h-[116px] w-full flex-col transition-all hover:shadow-md">
      <Link
        to={`/${teamSlug}/${projectId}/surveys/${survey.id}`}
        className="absolute inset-0 cursor-pointer overflow-hidden rounded-lg"
      >
        <span className="sr-only">View Survey</span>
      </Link>

      <CardContent className="flex-1 space-y-2 p-3">
        <div className="flex items-start justify-between">
          <div className="flex max-w-[90%] items-center gap-2">
            <h3 className="truncate text-sm font-medium">
              {survey.title}
            </h3>
            <Badge variant="secondary" className="h-4 text-xs">
              {survey.status}
            </Badge>
          </div>
        </div>

        {survey.description && (
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {survey.description}
          </p>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="h-11 px-3 py-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-4 w-4">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate max-w-[200px] text-foreground">
              {user?.fullName ?? user?.emailAddresses[0].emailAddress}
            </span>
            <span className="hidden sm:inline">
              Updated {formatDistanceToNow(new Date(survey.updatedAt ?? survey.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="relative z-20">
            <SurveyActions survey={survey} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 