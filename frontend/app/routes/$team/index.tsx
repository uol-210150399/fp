import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectsSidebar } from "./components/projects-sidebar"
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

export const clientLoader = async ({ params }: LoaderFunctionArgs) => {
  return {
    teamSlug: params.team
  }
}

export default function TeamIndex() {
  const { teamSlug } = useLoaderData<typeof clientLoader>();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const { data } = useQuery(GET_TEAMS, {
    variables: {
      pagination: { first: 10 }
    }
  });

  const team = data?.teams.data.edges.find(
    (edge: { node: { slug: string } }) => edge.node.slug === teamSlug
  )?.node;

  if (data && !team) {
    return <InvalidTeam />;
  }

  const projects = team?.projects.filter((p: Project) => !p.isDeleted);

  return (
    <SidebarProvider>
      <ProjectsSidebar recentProjects={projects?.slice(0, 4)} team={team} />
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
          teamSlug={teamSlug ?? ""}
          teamId={team?.id ?? ""}
        />
      </SidebarInset>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        teamId={team?.id ?? ""}
      />
    </SidebarProvider>
  )
}
