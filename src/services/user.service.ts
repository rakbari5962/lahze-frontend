import { apiGet } from "./api";


export interface CurrentUser {

  id: number;

  phone: string;

  profile_completed: boolean;

}



export async function getCurrentUser(
  token: string
): Promise<CurrentUser> {


  return apiGet<CurrentUser>(
    `/users/me?token=${token}`
  );

}