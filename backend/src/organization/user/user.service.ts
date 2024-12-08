import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private repository: UsersRepository) {}

  async create(userId: string, email: string, name: string): Promise<string> {
    await this.repository.createUser(userId, email, name);
    return userId;
  }

  async get(userId: string): Promise<any> {
    return await this.repository.findUserById(userId);
  }
}
