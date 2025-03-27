import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserQueryResolver } from './resolvers/user-query.resolver';
import { ClerkService } from 'src/auth/clerk.service';

@Module({
  providers: [UserService, UserQueryResolver, ClerkService],
  exports: [UserService],
})
export class UserModule { } 