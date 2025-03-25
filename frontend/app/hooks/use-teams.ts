import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from '@/lib/team.queries';
import { Team } from '@/backend.types';

export function useTeams() {
  const { data, loading, error } = useQuery(GET_TEAMS, {
    variables: {
      pagination: { first: 100 } // Fetch first 100 teams
    }
  });

  const teams = data?.teams?.data?.edges.map((edge: { node: Team }) => edge.node) as Team[] ?? [];

  return {
    teams,
    loading,
    error
  };
}

export function useTeam(teamId: string) {
  const { teams, loading, error } = useTeams();
  const team = teams.find(team => team.id === teamId || team.slug === teamId);

  return {
    team,
    loading,
    error
  };
}

export function useProject(teamId: string, projectId: string) {
  const { team } = useTeam(teamId);
  const project = team?.projects.find(project => project.id === projectId);
  return {
    project,
  };
}

