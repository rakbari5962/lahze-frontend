import { apiPost, apiPatch, apiGet } from "./api";



export interface BusinessSummary {

  id: number;

  name: string;

}



export interface OpportunitySummary {

  id: number;

  start_time: string;

  end_time: string;

  final_price: number;

}



export interface WalletHoldSummary {

  amount: number;

  status: string;

  created_at: string;

  released_at?: string | null;

}



export interface BookingResponse {

  id: number;

  user_id: number;

  business_id: number;

  opportunity_id: number;

  status: string;


  created_at?: string;

  confirmed_at?: string | null;

  completed_at?: string | null;

  cancelled_at?: string | null;



  business?: BusinessSummary;



  opportunity?: OpportunitySummary;



  wallet_hold?: WalletHoldSummary;

}






// ایجاد رزرو

export async function createBooking(

  opportunityId: number,

  token: string

): Promise<BookingResponse> {


  return apiPost<BookingResponse>(

    `/bookings/?token=${token}`,

    {

      opportunity_id: opportunityId

    }

  );

}







// دریافت یک رزرو

export async function getBooking(

  bookingId: number

): Promise<BookingResponse> {


  return apiGet<BookingResponse>(

    `/bookings/${bookingId}`

  );

}







// تایید رزرو توسط کسب و کار

export async function confirmBooking(

  bookingId: number

): Promise<BookingResponse> {


  return apiPatch<BookingResponse>(

    `/bookings/${bookingId}/confirm`,

    {}

  );

}







// لغو رزرو Pending

export async function cancelBooking(

  bookingId: number

): Promise<BookingResponse> {


  return apiPatch<BookingResponse>(

    `/bookings/${bookingId}/cancel`,

    {}

  );

}







// لغو رزرو تایید شده

export async function cancelConfirmedBooking(

  bookingId: number

): Promise<BookingResponse> {


  return apiPatch<BookingResponse>(

    `/bookings/${bookingId}/cancel-confirm`,

    {}

  );

}







// تکمیل خدمت

export async function completeBooking(

  bookingId: number

): Promise<BookingResponse> {


  return apiPatch<BookingResponse>(

    `/bookings/${bookingId}/complete`,

    {}

  );

}







// گزارش عدم حضور مشتری

export async function reportNoShow(

  bookingId: number

) {


  return apiPost(

    `/bookings/${bookingId}/no-show`,

    {}

  );

}







// اعتراض مشتری به No Show

export async function disputeNoShow(

  bookingId: number

) {


  return apiPost(

    `/bookings/${bookingId}/no-show-dispute`,

    {}

  );

}







// رزروهای یک کاربر

export async function getUserBookings(

  userId: number

): Promise<BookingResponse[]> {


  return apiGet<BookingResponse[]>(

    `/bookings/user/${userId}`

  );

}