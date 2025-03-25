import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../project/model/project.entity';
import { TeamMembershipEntity, TeamRole } from '../model/team-membership.entity';
import { ProjectCreateInput, ProjectUpdateInput } from '../../generated/graphql';
import {
  ProjectNotFoundException,
  ProjectPermissionDeniedException,
} from '../exceptions/project.exceptions';
import { TeamService } from './team.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(TeamMembershipEntity)
    private readonly teamMembershipRepository: Repository<TeamMembershipEntity>,
    private readonly teamService: TeamService,
  ) { }

  async getProject(id: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['team', 'team.memberships', 'createdByMembership'],
    });

    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    return project;
  }

  async listProjects(input: {
    pagination: { first: number; after?: string },
    filter?: { teamId: string }
  }): Promise<{ projects: ProjectEntity[]; hasNextPage: boolean }> {
    const { first, after } = input.pagination;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.team', 'team')
      .leftJoinAndSelect('project.createdByMembership', 'createdByMembership')
      .take(first + 1);

    if (input.filter?.teamId) {
      queryBuilder.andWhere('project.teamId = :teamId', { teamId: input.filter.teamId });
    }

    if (after) {
      queryBuilder.andWhere('project.id > :after', { after });
    }

    const projects = await queryBuilder.getMany();
    const hasNextPage = projects.length > first;

    return {
      projects: projects.slice(0, first),
      hasNextPage,
    };
  }

  async createProject(input: ProjectCreateInput, userId: string): Promise<ProjectEntity> {
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId: input.teamId, userId }
    });

    if (!membership) {
      throw new ProjectPermissionDeniedException('You must be a team member to create projects');
    }

    // Verify team exists
    await this.teamService.getTeam(input.teamId, userId);

    const project = this.projectRepository.create({
      name: input.name,
      teamId: input.teamId,
      createdByMembershipId: membership.id,
    });

    return this.projectRepository.save(project);
  }

  async updateProject(input: ProjectUpdateInput, userId: string): Promise<ProjectEntity> {
    const project = await this.getProject(input.id);

    // Check if user has permission to update
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId: project.teamId, userId }
    });

    if (!membership ||
      (membership.role !== TeamRole.OWNER &&
        membership.role !== TeamRole.ADMIN &&
        membership.id !== project.createdByMembershipId)) {
      throw new ProjectPermissionDeniedException('You do not have permission to update this project');
    }

    if (input.name !== undefined) {
      project.name = input.name;
    }

    return this.projectRepository.save(project);
  }

  async deleteProject(id: string, userId: string): Promise<ProjectEntity> {
    const project = await this.getProject(id);

    // Check if user has permission to delete
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId: project.teamId, userId }
    });

    if (!membership ||
      (membership.role !== TeamRole.OWNER &&
        membership.role !== TeamRole.ADMIN &&
        membership.id !== project.createdByMembershipId)) {
      throw new ProjectPermissionDeniedException('You do not have permission to delete this project');
    }

    project.isDeleted = true;
    project.updatedAt = new Date();
    // Soft delete the project
    await this.projectRepository.save(project);
    return project;
  }

  async validateProjectAccess(projectId: string, userId: string, requiredRoles?: TeamRole[]): Promise<boolean> {
    const project = await this.getProject(projectId);
    const membership = await this.teamMembershipRepository.findOne({
      where: { teamId: project.teamId, userId }
    });

    if (!membership) {
      throw new ProjectPermissionDeniedException('You do not have access to this project');
    }

    if (requiredRoles && !requiredRoles.includes(membership.role)) {
      throw new ProjectPermissionDeniedException('You do not have the required role to perform this action');
    }

    return true;
  }
} 