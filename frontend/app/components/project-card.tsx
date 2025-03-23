import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Folder, MoreHorizontal, WandSparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Project } from "@/backend.types";
import { useUser } from "@clerk/clerk-react";
import { ProjectActions } from "./project-actions";

interface ProjectCardProps {
  project: Project;
  teamSlug: string;
}

export function ProjectCard({ project, teamSlug }: ProjectCardProps) {
  const { user } = useUser();

  return (
    <Card className="group relative shadow-none flex min-h-[127px] w-full flex-col transition-all hover:bg-accent/20">
      <a href={`/${teamSlug}/${project.id}`} className="absolute inset-0 z-10 cursor-pointer overflow-hidden rounded-lg">
        <span className="sr-only">View Project</span>
      </a>

      <CardHeader className="grid flex-1 auto-rows-min items-start gap-3 p-3 text-sm">
        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground after:absolute after:inset-0 after:rounded-lg after:border">
          <Folder className="size-4" />
        </div>
        <div className="grid auto-rows-min items-start gap-2">
          <h3 className="line-clamp-1 flex h-[14px] max-w-[80%] items-center gap-1 whitespace-normal font-medium leading-none tracking-tight">
            <span>{project.name}</span>
          </h3>
          <p className="text-sm text-muted-foreground">0 <span>Surveys</span></p>
        </div>
      </CardHeader>

      <Separator className="px-2" />

      <CardFooter className="flex h-11 items-center px-3 py-0">
        <div className="flex min-w-0 items-center gap-1 text-sm leading-none text-muted-foreground">
          <span className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm after:absolute after:inset-0 after:border">
            <img
              src={user?.imageUrl}
              alt={user?.fullName ?? "User"}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="truncate font-medium text-foreground">
            {user?.fullName}
          </span>
          <div className="truncate whitespace-nowrap">
            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
        </div>
        <ProjectActions project={project} />
      </CardFooter>
    </Card>
  );
} 