import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from "@/lib/team.queries";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "@remix-run/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/empty-state";
import { CreateTeamDialog } from "@/components/create-team-dialog";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from 'node_modules/date-fns/formatDistanceToNow';

export default function Index() {
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_TEAMS, {
    variables: {
      pagination: { first: 10 }
    }
  });

  // Redirect to first team on initial page load
  useEffect(() => {
    // Only redirect if we have teams data and we're at the root URL
    if (data?.teams.data.edges.length > 0 && window.location.pathname === '/') {
      const firstTeam = data.teams.data.edges[0].node;
      navigate(`/${firstTeam.slug}`);
    }
  }, [data, navigate]);

  // If we're loading or redirecting, show nothing
  if (loading || (data?.teams.data.edges.length > 0)) return null;

  const teams = data?.teams.data.edges.map((edge: any) => edge.node) ?? [];

  const filteredTeams = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return teams;
    return teams.filter(team =>
      team.name.toLowerCase().includes(query)
    );
  }, [teams, searchQuery]);

  // Only show empty state if we have no teams
  if (!teams.length) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <EmptyState
          title="No teams yet"
          description="Create your first team to get started"
          buttonText="Create team"
          onCreateClick={() => setCreateTeamOpen(true)}
        />
        <CreateTeamDialog
          open={createTeamOpen}
          onOpenChange={setCreateTeamOpen}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Teams</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button size="sm" onClick={() => setCreateTeamOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </header>

      {/* Search Header */}
      <div className="bg-background border-b-alpha-50 border-t border-t-alpha-50 mx-auto flex h-[50px] w-full shrink-0 items-center justify-center gap-2 border-b px-4">
        <div className="w-full min-w-0 overflow-x-hidden">
          <form className="flex h-[22px] flex-1 items-center justify-start gap-2">
            <label className="pointer-events-none flex items-center justify-center rounded-lg" htmlFor="search-teams">
              <MagnifyingGlassIcon className="size-4 !text-gray-500" />
              <span className="sr-only">Search</span>
            </label>
            <input
              id="search-teams"
              type="search"
              className="focus-visible:border-alpha-600 disabled:border-alpha-300 bg-background inline-flex shrink-0 border py-1 text-sm outline-none transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 h-full w-full rounded-lg border-none px-1 shadow-none [&::-webkit-search-cancel-button]:appearance-none"
              placeholder="Search for a team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto w-full px-4 py-4">
        <div className="flex flex-col gap-3">
          {filteredTeams.map((team) => (
            <div key={team.id} className="w-full">
              <li className="list-none">
                <a href={`/${team.slug}`}>
                  <div className="group rounded-md p-2 hover:bg-zinc-100">
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-col gap-1 grow justify-center overflow-hidden">
                        <div className="flex flex-nowrap gap-2 justify-between">
                          <p className="text-sm font-medium text-zinc-900">{team.name}</p>
                        </div>
                        <div className="flex font-normal text-zinc-600">
                          <span className="text-xs">
                            Last edited {formatDistanceToNow(new Date(team.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </a>
              </li>
            </div>
          ))}
        </div>
      </div>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </div>
  );
}   