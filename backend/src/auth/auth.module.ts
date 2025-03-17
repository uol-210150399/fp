import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ClerkModule } from './clerk.module';
import { ClerkService } from './clerk.service';

@Module({
  imports: [ClerkModule],
  providers: [AuthGuard, ClerkService],
  exports: [AuthGuard, ClerkService],
})
export class AuthModule { } 