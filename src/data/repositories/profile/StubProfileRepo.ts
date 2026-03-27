import type { Profile } from "../../../types/profile";
import type { ProfileRepo } from "./ProfileRepo";

import { profiles } from "../../data";

export class StubProfileRepo implements ProfileRepo {
  async getProfile(caregiverId: string): Promise<Profile> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    return { ...profile };
  }

  async updateFirstName(caregiverId: string, firstName: string): Promise<void> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);
    if (!profile) throw new Error("Profile not found");
    profile.firstName = firstName;
  }

  async updateLastName(caregiverId: string, lastName: string): Promise<void> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);
    if (!profile) throw new Error("Profile not found");
    profile.lastName = lastName;
  }

  async updateEmail(caregiverId: string, email: string): Promise<void> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);
    if (!profile) throw new Error("Profile not found");
    profile.email = email;
  }

  async updatePhoneNumber(
    caregiverId: string,
    phoneNumber: string,
  ): Promise<void> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);
    if (!profile) throw new Error("Profile not found");
    profile.phoneNumber = phoneNumber;
  }

  async updateJobTitle(caregiverId: string, jobTitle: string): Promise<void> {
    const profile = profiles.find((p) => p.caregiverId === caregiverId);
    if (!profile) throw new Error("Profile not found");
    profile.jobTitle = jobTitle;
  }

  async deleteProfile(caregiverId: string): Promise<void> {
    const index = profiles.findIndex((p) => p.caregiverId === caregiverId);
    if (index === -1) throw new Error("Profile not found");
    profiles.splice(index, 1);
  }
}
