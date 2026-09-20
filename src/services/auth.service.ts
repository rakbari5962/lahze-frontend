import { apiPost } from "./api";



export async function requestOtp(

  phone_number: string

) {


  return apiPost<{

    success: boolean;

    message: string;

  }>(

    `/auth/request-otp?phone_number=${phone_number}`,

    {}

  );

}







export async function verifyOtp(

  phone_number: string,

  code: string

) {


  return apiPost<{

    success: boolean;

    requires_city_selection: boolean;

    user_id: number;

    phone_number: string;

    session_token?: string;

  }>(

    `/auth/verify-otp?phone_number=${phone_number}&code=${code}`,

    {}

  );

}