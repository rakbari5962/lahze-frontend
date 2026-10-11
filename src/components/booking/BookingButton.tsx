"use client";

import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { createBooking } from "@/services/booking.service";

interface BookingButtonProps {
  opportunityId: number;
}

export default function BookingButton({
  opportunityId,
}: BookingButtonProps) {
  const router = useRouter();
  async function handleBooking() {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const booking = await createBooking(
        opportunityId,
        token
      );

      console.log(
        "BOOKING CREATED:",
        booking
      );

      alert("رزرو با موفقیت ثبت شد");
    } catch (error) {
      console.error(error);

      alert("خطا در ثبت رزرو");
    }
  }

  return (
    <button
      type="button"
      onClick={handleBooking}
      className="business-booking-button"
    >
      رزرو
    </button>
  );
}