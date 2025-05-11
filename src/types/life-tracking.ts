
export interface LifeTrackerSettingsData {
  birthDate: string; // ISO string format "yyyy-MM-dd"
  lifeExpectancy: number; // in years
  enableNotifications: boolean;
  // timezone?: string; // Optional: could be added later
}
