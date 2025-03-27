import type * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarGroup, SidebarHeader, SidebarRail, SidebarMenuButton, SidebarGroupLabel, SidebarMenuItem } from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { Project, Team } from "@/backend.types"
import { TeamSettingsDialog } from "@/components/settings/team-settings-dialog"
import { useSurveys } from "@/hooks/use-surveys"
import { Link } from "@remix-run/react"
import { formatDistanceToNow } from "date-fns"

interface ProjectsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  teamId: string;
  projectId: string;
}

export function ProjectSidebar({ teamId, projectId, ...props }: ProjectsSidebarProps) {
  const { surveys = [], loading } = useSurveys(projectId);

  // Sort surveys by updatedAt and take the 5 most recent
  const recentSurveys = [...surveys]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((survey) => ({
      id: survey.id,
      title: survey.title,
      updatedAt: survey.updatedAt,
    }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teamId={teamId} projectId={projectId} />
      </SidebarHeader>
      <SidebarContent>
        <RecentSurveysActivity
          surveys={recentSurveys}
          teamId={teamId}
          projectId={projectId}
          loading={loading}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <TeamSettingsDialog teamId={teamId} />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

interface RecentSurveyActivityProps {
  surveys: Array<{
    id: string;
    title: string;
    updatedAt: string;
  }>;
  teamId: string;
  projectId: string;
  loading: boolean;
}

function RecentSurveysActivity({
  surveys,
  teamId,
  projectId,
  loading
}: RecentSurveyActivityProps) {
  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Recent Surveys Activity</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>Loading...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Surveys Activity</SidebarGroupLabel>
      <SidebarMenu>
        {surveys.map((survey) => (
          <SidebarMenuItem key={survey.id}>
            <SidebarMenuButton asChild>
              <Link
                to={`/${teamId}/${projectId}/surveys/${survey.id}`}
                className="py-1.5 flex flex-col gap-0.5 justify-start items-start text-start"
              >
                <span className="text-sm text-start">{survey.title}</span>
                <span className="text-xs text-sidebar-foreground/70">
                  {formatDistanceToNow(new Date(survey.updatedAt), { addSuffix: true })}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {surveys.length > 4 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-sidebar-foreground/70"
            >
              <Link to={`/${teamId}/${projectId}/surveys`}>
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>View All</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}