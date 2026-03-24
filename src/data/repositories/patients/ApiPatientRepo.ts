import { supabase } from "../../../lib/supabase";
import type {
  PatientInfo,
  PatientBasicInfo,
  PatientContactInfo,
  PatientMedicalInfo,
  PatientEmergencyContact,
  PatientInsuranceInfo,
} from "../../../types/patient";

import type { PatientRepo } from "./PatientRepo";

export class ApiPatientRepo implements PatientRepo {
  async getPatientDetails(patientId: string): Promise<PatientInfo> {
    const { data, error } = await supabase
      .from("patients")
      .select(
        `
                *,
                emergency_contacts (first_name, last_name, email, phone_number, relationship),
                allergies (allergy_name),
                patient_conditions (condition_name)
            `,
      )
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    const ec = data.emergency_contacts?.[0];

    const formattedData: PatientInfo = {
      patientId: data.patient_id,
      firstName: data.first_name,
      lastName: data.last_name,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      email: data.email,
      phoneNumber: data.phone_number,
      bloodType: data.blood_type,
      height: data.height,
      weight: data.weight,
      allergies:
        data.allergies?.map((a: { allergy_name: string }) => a.allergy_name) ??
        [],
      conditions:
        data.patient_conditions?.map(
          (c: { condition_name: string }) => c.condition_name,
        ) ?? [],
      emergencyContactName: ec ? `${ec.first_name} ${ec.last_name}` : undefined,
      emergencyContactEmail: ec?.email,
      emergencyContactPhone: ec?.phone_number,
      emergencyContactRelationship: ec?.relationship,
      insuranceProvider: data.insurance_provider,
      insurancePolicyNumber: data.policy_number,
    };

    return formattedData;
  }

  /**
   * Update Methods for Patient Fields ---------
   */
  async updatePatientBasicInfo(
    patientId: string,
    updates: Partial<PatientBasicInfo>,
  ): Promise<PatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        dob: updates.dob,
        gender: updates.gender,
      })
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }

  async updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<PatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        address: contactInfo.address,
        phone_number: contactInfo.phoneNumber,
        email: contactInfo.email,
      })
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }

  async updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<PatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        blood_type: medicalInfo.bloodType,
        height: medicalInfo.height,
        weight: medicalInfo.weight,
      })
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    const allergyUpserts = (medicalInfo.allergies || []).map((allergy) =>
      supabase.from("allergies").upsert({
        patient_id: patientId,
        allergy_name: allergy,
      }),
    );

    await Promise.all(allergyUpserts);

    const conditionUpserts = (medicalInfo.conditions || []).map((condition) =>
      supabase.from("patient_conditions").upsert({
        patient_id: patientId,
        condition_name: condition,
      }),
    );

    await Promise.all(conditionUpserts);

    return this.getPatientDetails(patientId);
  }

  async updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<PatientInfo> {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("contact_id")
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    const contactId = data?.contact_id;

    const nameParts = (emergencyContactInfo.emergencyContactName ?? "").split(
      " ",
    );
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    const { error: upsertError } = await supabase
      .from("emergency_contacts")
      .upsert({
        contact_id: contactId,
        patient_id: patientId,
        first_name: firstName,
        last_name: lastName,
        email: emergencyContactInfo.emergencyContactEmail,
        phone_number: emergencyContactInfo.emergencyContactPhone,
        relationship: emergencyContactInfo.emergencyContactRelationship,
      });

    if (upsertError) throw upsertError;

    return this.getPatientDetails(patientId);
  }

  async updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<PatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        insurance_provider: insuranceInfo.insuranceProvider,
        policy_number: insuranceInfo.insurancePolicyNumber,
      })
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }
}
