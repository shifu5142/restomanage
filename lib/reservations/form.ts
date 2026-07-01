export type ReservationFormData = {
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  phone: string;
  notes: string;
};

export const EMPTY_RESERVATION_FORM: ReservationFormData = {
  date: "",
  time: "",
  partySize: 2,
  tableId: "",
  phone: "",
  notes: "",
};
