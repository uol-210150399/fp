import { TeamMember, TeamMemberRole } from '../../generated/graphql';
import { TeamMembershipEntity, TeamRole } from '../model/team-membership.entity';

export class TeamMemberDTOMapper {
  static toGraphQL(entity: TeamMembershipEntity): TeamMember {
    return {
      id: entity.id,
      userId: entity.userId,
      teamId: entity.teamId,
      role: this.mapTeamRoleToGraphQL(entity.role),
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static mapTeamRoleToGraphQL(role: TeamRole): TeamMemberRole {
    switch (role) {
      case TeamRole.ADMIN:
        return TeamMemberRole.ADMIN;
      case TeamRole.MEMBER:
        return TeamMemberRole.MEMBER;
      case TeamRole.OWNER:
        return TeamMemberRole.OWNER;
      default:
        return TeamMemberRole.MEMBER;
    }
  }

  static mapTeamRoleToEntity(role: TeamMemberRole): TeamRole {
    switch (role) {
      case TeamMemberRole.ADMIN:
        return TeamRole.ADMIN;
      case TeamMemberRole.MEMBER:
        return TeamRole.MEMBER;
      case TeamMemberRole.OWNER:
        return TeamRole.OWNER;
      default:
        return TeamRole.MEMBER;
    }
  }
} 