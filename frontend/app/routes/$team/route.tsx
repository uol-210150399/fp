import { ClientLoaderFunctionArgs, useLoaderData, useNavigate } from "@remix-run/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from "@/lib/team.queries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { useState, useEffect } from "react";
import { Project } from "@/backend.types";
import { ProjectsGrid } from "@/components/projects-grid";
import { InvalidTeam } from "@/components/invalid-team";
import { ProjectsSidebar } from "@/components/projects-sidebar";
import { Link } from "@remix-run/react";
import { useAuth, useClerk } from "@clerk/clerk-react";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { team } = params;
  return {
    team,
  };
};

export default function TeamIndex() {
  const { team } = useLoaderData<typeof clientLoader>();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const { data } = useQuery(GET_TEAMS, {
    variables: {
      pagination: { first: 10 }
    }
  });

  const teamData = data?.teams.data.edges.find(
    (edge: { node: { slug: string } }) => edge.node.slug === team
  )?.node;

  const clerk = useClerk()
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clerk.redirectToSignIn()
    }
  }, [isLoaded, isSignedIn, navigate]);

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
                  <BreadcrumbLink asChild>
                    <Link to="/">Teams</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{teamData?.name}</BreadcrumbPage>
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
