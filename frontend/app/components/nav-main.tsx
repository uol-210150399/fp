"use client"

import { useState } from "react";
import { Plus, Settings2, Folder } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TeamSettingsDialog } from "./settings/team-settings-dialog";
import { Team } from "@/backend.types";

interface NavMainProps {
  team: Team;
}

export function NavMain({ team }: NavMainProps) {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCreateProjectOpen(true);
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="flex items-center justify-between group">
            <a href="projects">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>Projects</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlusClick}
                className="h-6 w-6 ml-auto hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <TeamSettingsDialog team={team} />
        </SidebarMenuItem>
      </SidebarMenu>

      {team && (
        <CreateProjectDialog
          open={createProjectOpen}
          onOpenChange={setCreateProjectOpen}
          teamId={team?.id}
        />
      )}
    </SidebarGroup>
  )
}
