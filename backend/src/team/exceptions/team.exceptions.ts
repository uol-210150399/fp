import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Team with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class TeamNameConflictException extends HttpException {
  constructor() {
    super('Team with similar name already exists', HttpStatus.CONFLICT);
  }
}

export class TeamMembershipConflictException extends HttpException {
  constructor() {
    super('User is already a member of this team', HttpStatus.CONFLICT);
  }
}

export class TeamPermissionDeniedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class TeamOperationNotAllowedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 