import { apiPost } from "./api";


export interface BookingResponse {

  id: number;

  user_id: number;

  business_id: number;

  opportunity_id: number;

  status: string;

}



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