import { apiGet } from "./api";


export async function getCurrentUser(
  token: string
) {

  return apiGet<{

    id: number;

    phone_number: string;

    role: string;

    profile_completed: boolean;

    city_id: number | null;

  }>(
    `/users/me?token=${token}`
  );

}