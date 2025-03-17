import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClerkService } from './clerk.service';
import { AuthObject } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private clerkService: ClerkService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    try {
      const auth = await this.clerkService.authenticateRequest(req);
      if (!auth.isSignedIn) {
        throw new UnauthorizedException('The request is not authenticated');
      }

      req.auth = auth.toAuth() as AuthObject;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate request');
    }
  }
} 