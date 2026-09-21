import { apiGet } from "./api";

import type {
  Opportunity
} from "@/types/opportunity";


export async function getBusinessOpportunities(
  businessId: number
): Promise<Opportunity[]> {


  const data = await apiGet<Opportunity[]>(
    `/opportunities/business/${businessId}`
  );


  console.log(
    "OPPORTUNITIES FROM API:",
    data
  );


  return data;

}