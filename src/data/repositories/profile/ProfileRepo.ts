import type { Profile } from "../../../types/profile";

export interface ProfileRepo {
  getProfile(caregiverId: string): Promise<Profile>;

  updateFirstName(caregiverId: string, firstName: string): Promise<void>;
  updateLastName(caregiverId: string, lastName: string): Promise<void>;

  updatePhoneNumber(caregiverId: string, phoneNumber: string): Promise<void>;
  updateJobTitle(caregiverId: string, jobTitle: string): Promise<void>;

  // deleteProfile(caregiverId: string): Promise<void>;
}
