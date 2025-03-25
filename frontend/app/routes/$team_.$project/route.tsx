import { ClientLoaderFunctionArgs, Outlet, useLoaderData } from "@remix-run/react";
import { ProjectSidebar } from "../../components/project-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProject } from "@/hooks/use-teams";

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

  return (
    <SidebarProvider>
      <ProjectSidebar teamId={team as string} projectId={projectId as string} />
      <Outlet />
    </SidebarProvider>
  )
}