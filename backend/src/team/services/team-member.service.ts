import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMembershipEntity, TeamRole } from '../model/team-membership.entity';
import { TeamService } from './team.service';
import {
  TeamNotFoundException,
  TeamPermissionDeniedException,
  TeamMembershipConflictException,
} from '../exceptions/team.exceptions';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMembershipEntity)
    private readonly teamMembershipRepository: Repository<TeamMembershipEntity>,
    private readonly teamService: TeamService,
  ) { }

  async getMember(membershipId: string): Promise<TeamMembershipEntity> {
    const membership = await this.teamMembershipRepository.findOne({
      where: { id: membershipId },
      relations: ['team'],
    });

    if (!membership) {
      throw new TeamNotFoundException(`Team member with id ${membershipId} not found`);
    }

    return membership;
  }

  async getMemberByTeamAndUser(teamId: string, userId: string): Promise<TeamMembershipEntity> {
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId, userId },
      relations: ['team'],
    });

    if (!membership) {
      throw new TeamNotFoundException(`Team member not found`);
    }

    return membership;
  }

  async listMembers(input: {
    pagination: { first: number; after?: string };
    filter?: { teamId?: string; userId?: string };
  }): Promise<{ members: TeamMembershipEntity[]; hasNextPage: boolean }> {
    const { first, after } = input.pagination;
    const { teamId, userId } = input.filter || {};

    const queryBuilder = this.teamMembershipRepository
      .createQueryBuilder('membership')
      .leftJoinAndSelect('membership.team', 'team')
      .take(first + 1);

    if (teamId) {
      queryBuilder.andWhere('membership.teamId = :teamId', { teamId });
    }

    if (userId) {
      queryBuilder.andWhere('membership.userId = :userId', { userId });
    }

    if (after) {
      queryBuilder.andWhere('membership.id > :after', { after });
    }

    const members = await queryBuilder.getMany();
    const hasNextPage = members.length > first;

    return {
      members: members.slice(0, first),
      hasNextPage,
    };
  }

  async updateMemberRole(
    teamId: string,
    targetUserId: string,
    newRole: TeamRole,
    requestingUserId: string,
  ): Promise<TeamMembershipEntity> {
    // Check if requesting user has permission
    const requestingMembership = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });

    if (!requestingMembership || requestingMembership.role !== TeamRole.OWNER && requestingMembership.role !== TeamRole.ADMIN) {
      throw new TeamPermissionDeniedException('Only team owners and admins can change member roles');
    }

    const membershipToUpdate = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: targetUserId },
    });

    if (!membershipToUpdate) {
      throw new TeamNotFoundException(`User is not a member of this team`);
    }

    // If changing from OWNER role, ensure it's not the last owner
    if (membershipToUpdate.role === TeamRole.OWNER && newRole !== TeamRole.OWNER) {
      const ownerCount = await this.teamMembershipRepository.count({
        where: { teamId, role: TeamRole.OWNER },
      });

      if (ownerCount <= 1) {
        throw new TeamPermissionDeniedException('Cannot change role of the last team owner');
      }
    }

    membershipToUpdate.role = newRole;
    return this.teamMembershipRepository.save(membershipToUpdate);
  }

  async removeMember(
    teamId: string,
    targetUserId: string,
    requestingUserId: string,
  ): Promise<boolean> {
    const requestingMembership = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });

    if (
      !requestingMembership ||
      (requestingMembership.role !== TeamRole.OWNER && requestingMembership.role !== TeamRole.ADMIN)
    ) {
      throw new TeamPermissionDeniedException('Only team owners and admins can remove members');
    }

    const membershipToRemove = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: targetUserId },
    });

    if (!membershipToRemove) {
      throw new TeamNotFoundException(`User is not a member of this team`);
    }

    if (membershipToRemove.role === TeamRole.OWNER) {
      const ownerCount = await this.teamMembershipRepository.count({
        where: { teamId, role: TeamRole.OWNER },
      });

      if (ownerCount <= 1) {
        throw new TeamPermissionDeniedException('Cannot remove the last team owner');
      }
    }

    await this.teamMembershipRepository.remove(membershipToRemove);
    return true;
  }

  async addMember(
    teamId: string,
    targetUserId: string,
    role: TeamRole = TeamRole.MEMBER,
    requestingUserId: string,
  ): Promise<TeamMembershipEntity> {
    const requestingMembership = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });

    if (
      !requestingMembership ||
      (requestingMembership.role !== TeamRole.OWNER && requestingMembership.role !== TeamRole.ADMIN)
    ) {
      throw new TeamPermissionDeniedException('Only team owners and admins can add members');
    }

    // Check if user is already a member
    const existingMembership = await this.teamMembershipRepository.findOne({
      where: { teamId, userId: targetUserId },
    });

    if (existingMembership) {
      throw new TeamMembershipConflictException();
    }

    // Verify team exists
    await this.teamService.getTeam(teamId, requestingUserId);

    const membership = this.teamMembershipRepository.create({
      teamId,
      userId: targetUserId,
      role,
    });

    return this.teamMembershipRepository.save(membership);
  }
} 