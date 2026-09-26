import { apiGet } from "./api";


import type {
  BusinessPublicProfile,
  BusinessReviewSummary,
  CustomerInsightsResponse
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


export async function getCustomerInsights(
  businessId: number
): Promise<CustomerInsightsResponse> {


  return apiGet<CustomerInsightsResponse>(
    `/businesses/${businessId}/customer-insights`
  );

}