export type ReservationType = "individual" | "group";

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  totalPeople: string;
  emergencyContact: string;
}

export interface TimeSlots {
  morning: string[];
  afternoon: string[];
  night: string[];
}
