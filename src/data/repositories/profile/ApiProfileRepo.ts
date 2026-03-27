import type { Profile } from "../../../types/profile";
import type { ProfileRepo } from "./ProfileRepo";

import { supabase } from "../../../lib/supabase";

export class ApiProfileRepo implements ProfileRepo {
  async getProfile(caregiverId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("caregivers")
      .select("first_name, last_name, email, phone_number, job_title")
      .eq("caregiver_id", caregiverId)
      .single();

    if (error) throw error;

    const formattedData: Profile = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phoneNumber: data.phone_number,
      jobTitle: data.job_title,
    };

    return formattedData;
  }

  async updateFirstName(caregiverId: string, firstName: string): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .update({ first_name: firstName })
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async updateLastName(caregiverId: string, lastName: string): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .update({ last_name: lastName })
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async updateEmail(caregiverId: string, email: string): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .update({ email })
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async updateJobTitle(caregiverId: string, jobTitle: string): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .update({ job_title: jobTitle })
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async updatePhoneNumber(
    caregiverId: string,
    phoneNumber: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .update({ phone_number: phoneNumber })
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async deleteProfile(caregiverId: string): Promise<void> {
    const { error } = await supabase
      .from("caregivers")
      .delete()
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }
}
