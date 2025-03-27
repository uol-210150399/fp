import { ChevronsUpDown, Plus, Building2, Check, Folder, ChevronRight, CornerRightDownIcon, CornerDownRightIcon } from "lucide-react"
import { useState } from "react";
import { CreateTeamDialog } from "./create-team-dialog";
import { useNavigate } from "@remix-run/react";
import { CreateProjectDialog } from "@/components/create-project-dialog"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Project, Team } from "@/backend.types";
import { useTeam, useTeams } from "@/hooks/use-teams";

interface TeamSwitcherProps {
  teamId: string;
  projectId?: string;
}

export function TeamSwitcher({ teamId, projectId }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const navigate = useNavigate();
  const [openTeam, setOpenTeam] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const { team: activeTeam } = useTeam(teamId);
  const { teams } = useTeams();

  const activeProject = activeTeam?.projects?.find(
    project => project.id === projectId
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );


  const handleTeamSelect = (team: Team) => {
    setOpenTeam(false);
    navigate(`/${team.slug}`);
  };

  const handleProjectSelect = (team: Team, project: Project) => {
    setOpenProject(false);
    navigate(`/${team.slug}/${project.id}/surveys`);
  };

  const TeamPopoverContent = () => (
    <Command className="w-full">
      <CommandInput
        placeholder="Find team..."
        value={teamSearch}
        onValueChange={setTeamSearch}
      />
      <CommandList>
        <CommandGroup heading="Teams">
          <CommandEmpty>No teams found.</CommandEmpty>
          {filteredTeams.map((team) => (
            <CommandItem
              key={team.id}
              onSelect={() => handleTeamSelect(team)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-blue-500">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{team.name}</span>
              </div>
              {team.id === teamId && <Check className="h-4 w-4" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t py-2 px-2">
        <CommandItem
          onSelect={() => setCreateTeamOpen(true)}
          className="flex items-center gap-2"
        >
          <div className="flex items-center justify-center rounded-md border">
            <Plus className="h-4 w-4" />
          </div>
          <span className="font-medium">Create Team</span>
        </CommandItem>
      </div>
    </Command>
  );

  const ProjectPopoverContent = () => (
    <Command className="w-full">
      <CommandInput
        placeholder="Find project..."
        value={projectSearch}
        onValueChange={setProjectSearch}
      />
      <CommandList>
        <CommandGroup heading="Projects">
          <CommandEmpty>No projects found.</CommandEmpty>
          {activeTeam?.projects?.filter(project =>
            project.name.toLowerCase().includes(projectSearch.toLowerCase())
          ).map((project) => (
            <CommandItem
              key={project.id}
              onSelect={() => handleProjectSelect(activeTeam, project)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-muted/50">
                  <Folder className="h-4 w-4" />
                </div>
                <span className="font-medium">{project.name}</span>
              </div>
              {project.id === projectId && <Check className="h-4 w-4" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t py-2 px-2">
        <CommandItem
          onSelect={() => setCreateProjectOpen(true)}
          className="flex items-center gap-2"
        >
          <div className="flex items-center justify-center rounded-md border">
            <Plus className="h-4 w-4" />
          </div>
          <span className="font-medium">Create Project</span>
        </CommandItem>
      </div>
    </Command>
  );

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-1">
          <Popover open={openTeam} onOpenChange={setOpenTeam}>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent"
                size="lg"
              >
                <Building2 className="size-5" />
                <span className="truncate max-w-24">{activeTeam?.name ?? "Select Team"}</span>
                <ChevronsUpDown className="ml-auto size-5" />
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 border rounded-md"
              align="start"
              side={isMobile ? "bottom" : "right"}
            >
              <TeamPopoverContent />
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>

        {activeTeam && (
          <SidebarMenuItem>
            <Popover open={openProject} onOpenChange={setOpenProject}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent"
                  size="lg"
                >
                  <CornerDownRightIcon className="size-5 mr-2" />
                  <Folder className="size-5" />
                  <span className="truncate max-w-24">
                    {activeProject?.name ?? "Select Project"}
                  </span>
                  <ChevronsUpDown className="ml-auto size-5" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 border rounded-md"
                align="start"
                side={isMobile ? "bottom" : "right"}
              >
                <ProjectPopoverContent />
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        )}
      </SidebarMenu>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        teamId={teamId}
      />
    </>
  )
}
