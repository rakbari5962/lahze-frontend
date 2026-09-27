import {
  apiGet,
  apiPatch
} from "./api";




export interface CurrentUser {

  id: number;

  phone_number: string;

  profile_completed: boolean;



  first_name?: string | null;

  last_name?: string | null;



  secondary_phone?: string | null;

  national_id?: string | null;



  gender?: string | null;

  birth_date?: string | null;



  education?: string | null;

  job_title?: string | null;



  bio?: string | null;



  iban?: string | null;

  email?: string | null;



  province_id?: number | null;

  city_id?: number | null;

  city_name?: string | null;

}






export async function getCurrentUser(
  token: string
): Promise<CurrentUser> {


  return apiGet<CurrentUser>(
    `/users/me?token=${encodeURIComponent(token)}`
  );

}







export async function updateUserProfile(
  token: string,
  data: Partial<CurrentUser>
): Promise<CurrentUser> {


  return apiPatch<CurrentUser>(
    `/users/me/profile?token=${encodeURIComponent(token)}`,
    data
  );

}


