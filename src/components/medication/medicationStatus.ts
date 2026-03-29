export type MedicationStatus = "taken" | "overdue" | "pending";

export function getMedicationStatus(
     isCompleted: boolean,
     scheduledDate: Date | null,
     now: Date = new Date(),
): MedicationStatus {
     const hasValidScheduledDate =
          scheduledDate instanceof Date && !Number.isNaN(scheduledDate.getTime());

     if (isCompleted) return "taken";
     if (hasValidScheduledDate && scheduledDate < now) return "overdue";
     return "pending";
}

export function getMedicationStatusLabel(status: MedicationStatus): string {
     if (status === "taken") return "Taken";
     if (status === "overdue") return "Overdue";
     return "Pending";
}

export function getMedicationStatusStyles(status: MedicationStatus) {
     if (status === "taken") {
          return {
               border: "1px solid #98d4a9",
               backgroundColor: "#f3fbf5",
               badgeBackground: "#d1e7dd",
               badgeColor: "#146c43",
          };
     }

     if (status === "overdue") {
          return {
               border: "1px solid #f5c2c7",
               backgroundColor: "#fff5f5",
               badgeBackground: "#f8d7da",
               badgeColor: "#b02a37",
          };
     }

     return {
          border: "1px solid #e9ecef",
          backgroundColor: "#ffffff",
          badgeBackground: "#f1f3f5",
          badgeColor: "#495057",
     };
}