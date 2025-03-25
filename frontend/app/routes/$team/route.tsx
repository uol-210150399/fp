import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from "@/lib/team.queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { useState } from "react";
import { Project } from "@/backend.types";
import { ProjectsGrid } from "@/components/projects-grid";
import { InvalidTeam } from "@/components/invalid-team";
import { ProjectsSidebar } from "@/components/projects-sidebar";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { team } = params;
  return {
    team,
  };
};

export default function TeamIndex() {
  const { team } = useLoaderData<typeof clientLoader>();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const { data } = useQuery(GET_TEAMS, {
    variables: {
      pagination: { first: 10 }
    }
  });

  const teamData = data?.teams.data.edges.find(
    (edge: { node: { slug: string } }) => edge.node.slug === team
  )?.node;

  if (data && !teamData) {
    return <InvalidTeam />;
  }

  const projects = teamData?.projects.filter((p: Project) => !p.isDeleted);

  return (
    <SidebarProvider>
      <ProjectsSidebar recentProjects={projects?.slice(0, 4)} team={teamData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button size="sm" onClick={() => setCreateProjectOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </header>
        <ProjectsGrid
          projects={projects ?? []}
          teamSlug={team ?? ""}
          teamId={teamData?.id ?? ""}
        />
      </SidebarInset>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        teamId={teamData?.id ?? ""}
      />
    </SidebarProvider>
  )
}
