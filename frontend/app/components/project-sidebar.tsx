import type * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarGroup, SidebarHeader, SidebarRail, SidebarMenuButton, SidebarGroupLabel, SidebarMenuItem } from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { Project, Team } from "@/backend.types"
import { TeamSettingsDialog } from "@/components/settings/team-settings-dialog"

const data = {
  recentSurveysActivity: [
    {
      title: "NPS Survey Results",
      url: "#",
    },
    {
      title: "Customer Satisfaction Survey",
      url: "#",
    },
    {
      title: "Product Usage Interview",
      url: "#",
    },
  ],
}


interface ProjectsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  teamId: string;
  projectId: string;
}

export function ProjectSidebar({ teamId, projectId, ...props }: ProjectsSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teamId={teamId} projectId={projectId} />
      </SidebarHeader>
      <SidebarContent>
        <RecentSurveysActivity surveys={data.recentSurveysActivity} />
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

function RecentSurveysActivity({
  surveys,
}: {
  surveys: {
    title: string
    url: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Surveys Activity</SidebarGroupLabel>
      <SidebarMenu>
        {surveys.map((survey) => (
          <SidebarMenuItem key={survey.title}>
            <SidebarMenuButton asChild>
              <a href={survey.url} className="py-1.5">
                <span>{survey.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>View All</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}