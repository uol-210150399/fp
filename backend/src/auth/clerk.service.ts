import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type ClerkClient, createClerkClient, verifyToken } from '@clerk/backend'
import { Request as ExpressRequest } from 'express';

@Injectable()
export class ClerkService {
  private clerk: ClerkClient;

  constructor(private configService: ConfigService) {
    this.clerk = createClerkClient({
      secretKey: this.configService.get<string>('clerkSecretKey'),
    });
  }

  async authenticateRequest(request: ExpressRequest): Promise<{
    isSignedIn: boolean;
    toAuth: () => ({
      userId: string;
    } | null);
  }> {
    const sessionToken = request.headers['authorization']
    try {
      const verifiedToken = await verifyToken(sessionToken, {
        jwtKey: process.env.CLERK_JWT_KEY,
      })

      return {
        isSignedIn: true,
        toAuth: () => ({
          userId: verifiedToken.sub,
        }),
      }
    } catch (error) {
      return {
        isSignedIn: false,
        toAuth: () => null,
      }
    }
  }

  async getUser(userId: string) {
    return this.clerk.users.getUser(userId);
  }
} 