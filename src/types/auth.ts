
// This interface was used for client-side mock user storage.
// With Firebase Auth, the primary user object comes from Firebase itself.
// However, we might still use a similar structure for caching user profile data from Firestore.
export interface MockRegisteredUser {
  uid: string; // Added UID to align better with Firebase
  name: string;
  email: string;
  password?: string; // Storing plain password for mock purposes ONLY. Not for production.
  avatar?: string;
}
