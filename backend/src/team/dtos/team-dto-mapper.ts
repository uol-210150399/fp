import { Team } from "src/generated/graphql";
import { TeamEntity } from "../model/team.entity";
import { TeamMemberDTOMapper } from "./team-member-dto-mapper";
import { ProjectDTOMapper } from "./project-dto-mapper";

export class TeamDTOMapper {
  static toGraphQL(team: TeamEntity): Team {
    return {
      id: team.id,
      name: team.name,
      slug: team.slug,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt?.toISOString(),
      isDeleted: team.isDeleted,
      members: team.memberships?.map(membership => TeamMemberDTOMapper.toGraphQL(membership)) ?? [],
      projects: team.projects?.map(project => ProjectDTOMapper.toGraphQL(project)) ?? [],
    };
  }
}