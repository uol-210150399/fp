import { Project } from '../../generated/graphql';
import { ProjectEntity } from '../../project/model/project.entity';

export class ProjectDTOMapper {
  static toGraphQL(entity: ProjectEntity): Project {
    return {
      id: entity.id,
      name: entity.name,
      teamId: entity.teamId,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
} 