import { HttpException, HttpStatus } from '@nestjs/common';

export class ProjectNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Project with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ProjectPermissionDeniedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ProjectOperationNotAllowedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 