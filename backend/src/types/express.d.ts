import { AuthObject } from '@clerk/backend';

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject | undefined;
    }
  }
}

// This needs to be here to be treated as a module
export { }; 