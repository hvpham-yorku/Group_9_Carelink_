import { supabase } from "../../../lib/supabase";
import type {
  AllPatientInfo,
  PatientContactInfo,
  PatientMedicalInfo,
  PatientConditions,
  PatientEmergencyContact,
  PatientInsuranceInfo,
  PatientPhysicianInfo,
} from "../../../types/patient";

import type { PatientRepo } from "./PatientRepo";

export class ApiPatientRepo implements PatientRepo {
  async getPatientDetails(patientId: string): Promise<AllPatientInfo> {
    const { data, error } = await supabase
      .from("patients")
      .select(
        `
                *,
                emergency_contacts (name, phone_number, relationship),
                allergies (allergy_name),
                patient_conditions (condition_name)
            `,
      )
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;

    const ec = data.emergency_contacts?.[0];

    const formattedData: AllPatientInfo = {
      patientId: data.patient_id,
      firstName: data.first_name,
      lastName: data.last_name,
      address: data.address,
      phoneNumber: data.phone_number,
      email: data.email,
      dob: data.dob,
      gender: data.gender,
      bloodType: data.blood_type,
      height: data.height,
      weight: data.weight,
      dietaryRequirements: data.dietary_requirements,
      allergies:
        data.allergies?.map((a: { allergy_name: string }) => a.allergy_name) ??
        [],
      conditions:
        data.patient_conditions?.map(
          (c: { condition_name: string }) => c.condition_name,
        ) ?? [],
      emergencyContactName: ec?.name,
      emergencyContactPhone: ec?.phone_number,
      emergencyContactRelationship: ec?.relationship,
      physicianName: data.phys_name,
      physicianSpecialty: data.phys_spec,
      physicianPhone: data.phys_phone,
      physicianAddress: data.phys_address,
      insuranceProvider: data.insurance_provider,
      insurancePolicyNumber: data.policy_number,
      groupNumber: data.group_number,
    };

    return formattedData;
  }

  /**
   * Update Methods for Patient Fields ---------
   */
  async updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<AllPatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        first_name: contactInfo.firstName,
        last_name: contactInfo.lastName,
        address: contactInfo.address,
        phone_number: contactInfo.phoneNumber,
        email: contactInfo.email,
      })
      .eq("patient_id", patientId);

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }

  async updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<AllPatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        dob: medicalInfo.dob,
        gender: medicalInfo.gender,
        blood_type: medicalInfo.bloodType,
        height: medicalInfo.height,
        weight: medicalInfo.weight,
        dietary_requirements: medicalInfo.dietaryRequirements,
      })
      .eq("patient_id", patientId);

    if (error) throw error;

    const allergyUpserts = (medicalInfo.allergies || []).map((allergy) =>
      supabase.from("allergies").upsert({
        patient_id: patientId,
        allergy_name: allergy,
      }),
    );

    await Promise.all(allergyUpserts);

    return this.getPatientDetails(patientId);
  }

  // check if condition exists - if yes, update, if no, insert. all conditions are set as active
  async updatePatientConditions(
    patientId: string,
    conditions: Partial<PatientConditions>,
  ): Promise<AllPatientInfo> {
    const existingConditions = await supabase
      .from("patient_conditions")
      .select("condition_id, condition_name")
      .eq("patient_id", patientId);

    const upsertPromises = (
      conditions.conditions ? conditions.conditions : []
    ).map((conditionName) => {
      const existing = existingConditions.data?.find(
        (c) => c.condition_name === conditionName,
      );
      return supabase.from("patient_conditions").upsert({
        condition_id: existing?.condition_id,
        patient_id: patientId,
        condition_name: conditionName,
        is_active: true,
      });
    });

    await Promise.all(upsertPromises);

    return this.getPatientDetails(patientId);
  }

  // check if emergency contact exists - if yes, update, if no, insert
  async updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<AllPatientInfo> {
    const name = emergencyContactInfo.emergencyContactName ?? "";
    const phone = emergencyContactInfo.emergencyContactPhone ?? null;
    const relationship =
      emergencyContactInfo.emergencyContactRelationship ?? null;

    const { data: existingEC } = await supabase
      .from("emergency_contacts")
      .select("contact_id")
      .eq("patient_id", patientId)
      .maybeSingle();

    if (existingEC) {
      await supabase
        .from("emergency_contacts")
        .update({
          name,
          phone_number: phone,
          relationship,
        })
        .eq("contact_id", existingEC.contact_id);
    } else {
      await supabase.from("emergency_contacts").insert({
        patient_id: patientId,
        name,
        phone_number: phone,
        relationship,
      });
    }

    return this.getPatientDetails(patientId);
  }

  async updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<AllPatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        insurance_provider: insuranceInfo.insuranceProvider,
        policy_number: insuranceInfo.insurancePolicyNumber,
        group_number: insuranceInfo.groupNumber,
      })
      .eq("patient_id", patientId);

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }

  async updatePatientPhysicianInfo(
    patientId: string,
    physicianInfo: Partial<PatientPhysicianInfo>,
  ): Promise<AllPatientInfo> {
    const { error } = await supabase
      .from("patients")
      .update({
        phys_name: physicianInfo.physicianName,
        phys_spec: physicianInfo.physicianSpecialty,
        phys_phone: physicianInfo.physicianPhone,
        phys_address: physicianInfo.physicianAddress,
      })
      .eq("patient_id", patientId);

    if (error) throw error;

    return this.getPatientDetails(patientId);
  }
}
