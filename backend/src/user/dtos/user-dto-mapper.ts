import { User } from '../../generated/graphql';
import { User as ClerkUser } from '@clerk/backend';

export class UserDTOMapper {
  static toGraphQL(user: ClerkUser): User {
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      imageUrl: user.imageUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 