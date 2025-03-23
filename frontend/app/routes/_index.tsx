import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import { GET_TEAMS } from "@/lib/team.queries";
import { TeamsResponse } from "@/backend.types";

export const LAST_TEAM_KEY = "lastTeamSlug";

export default function Index() {
  const navigate = useNavigate();
  const { data, loading } = useQuery<TeamsResponse>(GET_TEAMS);

  useEffect(() => {
    if (loading) return;

    const lastTeamSlug = localStorage.getItem(LAST_TEAM_KEY);
    const teams = data?.data?.edges
    console.log(teams)

    if (teams?.length === 0) {
      navigate("/create-team");
      return;
    }

    // If we have a last team and it still exists, use it
    if (lastTeamSlug && teams?.some((edge: { node: { slug: string } }) => edge.node.slug === lastTeamSlug)) {
      navigate(`/${lastTeamSlug}`);
      return;
    }

    // Otherwise use the first team
    const firstTeam = teams?.[0]?.node;
    if (firstTeam) {
      navigate(`/${firstTeam.slug}`);
    }
  }, [data, loading, navigate]);

  return null;
} 
