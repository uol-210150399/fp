export class SurveyNotFoundException extends Error {
  constructor(surveyId: string) {
    super(`Survey with ID ${surveyId} not found`);
    this.name = 'SurveyNotFoundException';
  }
}

export class SurveyPermissionDeniedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurveyPermissionDeniedException';
  }
}

export class SurveyValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurveyValidationException';
  }
} 