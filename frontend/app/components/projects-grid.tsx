import { Project } from "@/backend.types";
import { ProjectCard } from "./project-card";
import { EmptyState } from "./empty-state";
import { useState } from "react";
import { CreateProjectDialog } from "./create-project-dialog";

interface ProjectsGridProps {
  projects: Project[];
  teamSlug: string;
  teamId: string;
}

export function ProjectsGrid({ projects, teamSlug, teamId }: ProjectsGridProps) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  if (!projects.length) {
    return (
      <>
        <EmptyState onCreateClick={() => setCreateProjectOpen(true)} />
        <CreateProjectDialog
          open={createProjectOpen}
          onOpenChange={setCreateProjectOpen}
          teamId={teamId}
        />
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col overflow-auto px-0 py-4">
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 px-4 pb-4" style={{ maxWidth: "1360px" }}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              teamSlug={teamSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 