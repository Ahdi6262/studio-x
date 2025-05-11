
// This interface was used for client-side mock user storage.
// With Firebase Auth, the primary user object comes from Firebase itself.
// The UserData interface is now defined in auth-context.tsx.

// This file might not be strictly necessary anymore if UserData is solely defined
// and exported from auth-context.tsx. Consider removing if no other module imports from here.

export interface OldMockRegisteredUser { // Renamed to avoid conflict if UserData is preferred
  uid: string; 
  name: string;
  email: string;
  password?: string; 
  avatar?: string;
  bio?: string; // Added bio
  dashboard_layout_preferences?: Record<string, any>; // Added dashboard preferences
}
