import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../model/team.entity';
import { TeamMembershipEntity, TeamRole } from '../model/team-membership.entity';
import { TeamCreateInput, TeamUpdateInput } from '../../generated/graphql';
import {
  TeamNotFoundException,
  TeamNameConflictException,
  TeamPermissionDeniedException,
} from '../exceptions/team.exceptions';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMembershipEntity)
    private readonly teamMembershipRepository: Repository<TeamMembershipEntity>,
  ) { }

  async getTeam(id: string, userId: string): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: {
        id,
        memberships: {
          userId: userId
        }
      },
      relations: ['memberships', 'projects'],
    });

    if (!team) {
      throw new TeamNotFoundException(id);
    }

    return team;
  }

  async listTeams(input: { pagination: { first: number; after?: string }; filter: { userId: string } }): Promise<{ teams: TeamEntity[]; hasNextPage: boolean }> {
    const { first, after } = input.pagination;

    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.memberships', 'memberships')
      .leftJoinAndSelect('team.projects', 'projects')
      .where('memberships.userId = :userId', { userId: input.filter.userId })
      .take(first + 1);

    if (after) {
      queryBuilder.andWhere('team.id > :after', { after });
    }

    const teams = await queryBuilder.getMany();
    const hasNextPage = teams.length > first;

    return {
      teams: teams.slice(0, first),
      hasNextPage,
    };
  }

  async createTeam(input: TeamCreateInput, userId: string): Promise<TeamEntity> {
    // Generate slug from input.slug if provided, otherwise from name
    const slug = input.slug?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check for existing team with same slug
    const existingTeam = await this.teamRepository.findOne({
      where: { slug }
    });

    if (existingTeam) {
      throw new TeamNameConflictException();
    }

    const team = this.teamRepository.create({
      name: input.name,
      slug,
      createdByUserId: userId,
    });

    const savedTeam = await this.teamRepository.save(team);

    // Create team membership for creator as OWNER
    const membership = this.teamMembershipRepository.create({
      teamId: team.id,
      userId: userId,
      role: TeamRole.OWNER,
    });

    await this.teamMembershipRepository.save(membership);

    return savedTeam;
  }

  async updateTeam(input: TeamUpdateInput, userId: string): Promise<TeamEntity> {
    const team = await this.getTeam(input.id, userId);

    if (input.name) {
      const newSlug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existingTeam = await this.teamRepository.findOne({
        where: { slug: newSlug }
      });

      if (existingTeam && existingTeam.id !== team.id) {
        throw new TeamNameConflictException();
      }

      team.name = input.name;
      team.slug = newSlug;
    }

    await this.teamRepository.save(team);
    return this.getTeam(team.id, userId);
  }

  async deleteTeam(id: string, userId: string): Promise<TeamEntity> {
    const team = await this.getTeam(id, userId);

    // Check if user is owner
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId: id, userId: userId }
    });

    if (!membership || membership.role !== TeamRole.OWNER) {
      throw new TeamPermissionDeniedException('Only team owners can delete teams');
    }

    // Soft delete the team
    await this.teamRepository.softDelete(id);

    return team;
  }
} 