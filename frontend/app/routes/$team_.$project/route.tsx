import { ClientLoaderFunctionArgs, Outlet, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { ProjectSidebar } from "../../components/project-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProject } from "@/hooks/use-teams";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { team, project } = params;
  return {
    team,
    project,
  }
}

export default function Layout() {
  const { team, project: projectId } = useLoaderData<typeof clientLoader>();
  const { project } = useProject(team as string, projectId as string);
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const clerk = useClerk()
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clerk.redirectToSignIn()
    } else if (isLoaded && isSignedIn && projectId) {
      navigate(`/${team}/${projectId}/surveys`);
    }
  }, [isLoaded, isSignedIn, navigate, projectId, team]);

  return (
    <SidebarProvider>
      <ProjectSidebar teamId={team as string} projectId={projectId as string} />
      <Outlet />
    </SidebarProvider>
  )
}