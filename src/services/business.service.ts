import { apiGet } from "./api";


import type {
  BusinessPublicProfile,
  BusinessReviewSummary
} from "@/types/business";





export async function getBusinessPublicProfile(
  businessId: number
): Promise<BusinessPublicProfile> {


  return apiGet<BusinessPublicProfile>(
    `/businesses/${businessId}/public-profile`
  );

}





export async function getBusinessReviewSummary(
  businessId: number
): Promise<BusinessReviewSummary> {


  return apiGet<BusinessReviewSummary>(
    `/businesses/${businessId}/review-summary`
  );

}