import * as React from "react"
import { ChevronsUpDown, Plus, Building2 } from "lucide-react"
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from "@/lib/team.queries"
import { useState } from "react";
import { CreateTeamDialog } from "./create-team-dialog";
import { useNavigate } from "@remix-run/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface TeamNode {
  id: string;
  name: string;
  slug: string;
}

interface TeamsData {
  teams: {
    data: {
      edges: Array<{
        node: TeamNode;
        cursor: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
    error: {
      message: string;
      code: string;
    } | null;
  };
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const navigate = useNavigate();

  const { data: teamsData } = useQuery<TeamsData>(GET_TEAMS, {
    variables: {
      pagination: { first: 10 }
    }
  });

  const [activeTeam, setActiveTeam] = React.useState<TeamNode | null>(null)

  React.useEffect(() => {
    if (teamsData?.teams?.data?.edges[0]?.node) {
      setActiveTeam(teamsData.teams.data.edges[0].node)
    }
  }, [teamsData])

  const handleTeamSelect = (team: TeamNode) => {
    localStorage.setItem("lastTeamSlug", team.slug);
    navigate(`/${team.slug}`);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-accent-foreground text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam?.name ?? "Loading..."}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teamsData?.teams.data.edges.map((edge, index) => (
                <DropdownMenuItem
                  key={edge.node.id}
                  onClick={() => handleTeamSelect(edge.node)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-4 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  {edge.node.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setCreateTeamOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </>
  )
}
