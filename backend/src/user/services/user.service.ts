import { Injectable } from '@nestjs/common';
import { UserDTOMapper } from '../dtos/user-dto-mapper';
import { ClerkService } from '../../auth/clerk.service';
import { User } from '../../generated/graphql';

@Injectable()
export class UserService {
  constructor(
    private readonly clerkService: ClerkService,
  ) { }

  async getUsers(search?: string): Promise<User[]> {
    const users = await this.clerkService.getUsers(search);
    return users.data.map(UserDTOMapper.toGraphQL);
  }
} 