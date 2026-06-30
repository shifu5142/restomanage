export const RESERVATION_BASE_FEE = 25;
export const RESERVATION_PER_GUEST_FEE = 8;

export type ReservationPricing = {
  baseFee: number;
  guestFee: number;
  total: number;
};

export function calculateReservationPricing(
  partySize: number
): ReservationPricing {
  const guests = Math.max(1, partySize);
  const baseFee = RESERVATION_BASE_FEE;
  const guestFee = RESERVATION_PER_GUEST_FEE * guests;

  return {
    baseFee,
    guestFee,
    total: baseFee + guestFee,
  };
}
