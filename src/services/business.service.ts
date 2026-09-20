import { apiGet } from "./api";

import type {
  BusinessPublicProfile
} from "@/types/business";



export async function getBusinessPublicProfile(
  businessId: number
): Promise<BusinessPublicProfile> {


  return apiGet<BusinessPublicProfile>(
    `/businesses/${businessId}/public-profile`
  );

}