import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete
} from "./api";


import type {
  BusinessCreateResponse,
  BusinessPublicProfile,
  BusinessReviewSummary,
  CreateBusinessRequest,
  CustomerInsightsResponse,
  BusinessListItem,
  BusinessCompletionResponse,
  BusinessManagementResponse,
  BusinessProfileUpdate,
  BusinessLocationUpdate,
  BusinessServiceCreate,
  BusinessServiceResponse
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





export async function createBusiness(
  token: string,
  business: CreateBusinessRequest
): Promise<BusinessCreateResponse> {


  return apiPost<BusinessCreateResponse>(
    `/businesses/?token=${encodeURIComponent(token)}`,
    business
  );

}


export async function getMyBusinesses(
  token: string
): Promise<BusinessListItem[]> {

  return apiGet<BusinessListItem[]>(
    `/businesses/?token=${encodeURIComponent(token)}`
  );

}


export async function getBusinessCompletion(
  token: string,
  businessId: number
): Promise<BusinessCompletionResponse> {

  return apiGet<BusinessCompletionResponse>(
    `/businesses/${businessId}/completion?token=${encodeURIComponent(token)}`
  );

}


export async function getBusinessProfile(
  token: string,
  businessId: number
): Promise<BusinessManagementResponse> {

  return apiGet<BusinessManagementResponse>(
    `/businesses/${businessId}/profile?token=${encodeURIComponent(token)}`
  );

}


export async function updateBusinessProfile(
  token: string,
  businessId: number,
  data: BusinessProfileUpdate
): Promise<BusinessManagementResponse> {

  return apiPatch<BusinessManagementResponse>(
    `/businesses/${businessId}/profile?token=${encodeURIComponent(token)}`,
    data
  );

}


export async function updateBusinessLocation(
  token: string,
  businessId: number,
  data: BusinessLocationUpdate
): Promise<BusinessManagementResponse> {

  return apiPatch<BusinessManagementResponse>(
    `/businesses/${businessId}/location?token=${encodeURIComponent(token)}`,
    data
  );

}


export async function getBusinessServices(
  token: string,
  businessId: number
): Promise<BusinessServiceResponse[]> {

  return apiGet<BusinessServiceResponse[]>(
    `/businesses/${businessId}/services?token=${encodeURIComponent(token)}`
  );

}


export async function createBusinessService(
  token: string,
  businessId: number,
  data: BusinessServiceCreate
): Promise<BusinessServiceResponse> {

  return apiPost<BusinessServiceResponse>(
    `/businesses/${businessId}/services?token=${encodeURIComponent(token)}`,
    data
  );

}


export async function getBusinessService(
  token: string,
  serviceId: number
): Promise<BusinessServiceResponse> {

  return apiGet<BusinessServiceResponse>(
    `/businesses/services/${serviceId}?token=${encodeURIComponent(token)}`
  );

}


export async function updateBusinessService(
  token: string,
  serviceId: number,
  data: BusinessServiceCreate
): Promise<BusinessServiceResponse> {

  return apiPatch<BusinessServiceResponse>(
    `/businesses/services/${serviceId}?token=${encodeURIComponent(token)}`,
    data
  );

}


export async function deleteBusinessService(
  token: string,
  serviceId: number
): Promise<BusinessServiceResponse> {

  return apiDelete<BusinessServiceResponse>(
    `/businesses/services/${serviceId}?token=${encodeURIComponent(token)}`
  );

}