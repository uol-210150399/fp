import { Project } from "@/backend.types";
import { CreateProjectDialog } from "./create-project-dialog";
import { EmptyState } from "./empty-state";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ProjectList } from "./project-list";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ProjectsGridProps {
  projects: Project[];
  teamSlug: string;
  teamId: string;
}

export function ProjectsGrid({ projects, teamSlug, teamId }: ProjectsGridProps) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return projects;
    return projects.filter(project =>
      project.name.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  if (!projects.length) {
    return (
      <>
        <EmptyState
          title="No projects"
          description="Create your first project to get started"
          buttonText="Create project"
          onCreateClick={() => setCreateProjectOpen(true)}
        />
        <CreateProjectDialog
          open={createProjectOpen}
          onOpenChange={setCreateProjectOpen}
          teamId={teamId}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Search Header */}
      <div className="bg-background border-b-alpha-50 border-t border-t-alpha-50 mx-auto flex h-[50px] w-full shrink-0 items-center justify-center gap-2 border-b px-4">
        <div className="w-full min-w-0 overflow-x-hidden">
          <form className="flex h-[22px] flex-1 items-center justify-start gap-2">
            <label className="pointer-events-none flex items-center justify-center rounded-lg" htmlFor="search-projects">
              <MagnifyingGlassIcon className="size-4 !text-gray-500" />
              <span className="sr-only">Search</span>
            </label>
            <input
              id="search-projects"
              type="search"
              className="focus-visible:border-alpha-600 disabled:border-alpha-300 bg-background inline-flex shrink-0 border py-1 text-sm outline-none transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 h-full w-full rounded-lg border-none px-1 shadow-none [&::-webkit-search-cancel-button]:appearance-none"
              placeholder="Search for a project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto w-full px-4 py-4">
        <ProjectList projects={filteredProjects} teamSlug={teamSlug} />
      </div>
    </div>
  );
} 