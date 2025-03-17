export class TeamMemberNotFoundException extends Error {
  constructor(message: string = 'Team member not found') {
    super(message);
    this.name = 'TeamMemberNotFoundException';
  }
}

export class TeamMemberPermissionDeniedException extends Error {
  constructor(message: string = 'Permission denied') {
    super(message);
    this.name = 'TeamMemberPermissionDeniedException';
  }
} 