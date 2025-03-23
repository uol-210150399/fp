"use client"
import type * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarGroup, SidebarHeader, SidebarRail, SidebarMenuButton, SidebarGroupLabel, SidebarMenuItem } from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { formatDistanceToNow } from 'date-fns';
import { Project, Team } from "@/backend.types"

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
  recentProjects?: Project[];
  team: Team;
}

export function ProjectsSidebar({ recentProjects, team, ...props }: ProjectsSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain team={team} />
        {recentProjects && <RecentProjects projects={recentProjects} />}
        <RecentSurveysActivity surveys={data.recentSurveysActivity} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function RecentProjects({
  projects,
}: {
  projects: Project[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild>
              <a href={project.id} className="py-1.5">
                <span>{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
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