
export interface MockRegisteredUser {
  name: string;
  email: string;
  password?: string; // Storing plain password for mock purposes ONLY. Not for production.
  avatar?: string;
}
