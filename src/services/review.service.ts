import { 
  apiPost, 
  apiGet 
} from "./api"; 


export interface ReviewResponse { 

  id:number; 

  booking_id:number; 

  user_id:number; 

  business_id:number; 

  rating:number; 

  comment?:string | null; 

  created_at:string; 

} 



export interface ReviewCreate { 

  booking_id:number; 

  rating:number; 

  comment?:string; 

} 




// ثبت نظر

export async function createReview( 
  data: ReviewCreate 
): Promise<ReviewResponse>{ 


  return apiPost<ReviewResponse>( 
    "/reviews/", 
    data 
  ); 


} 





// دریافت نظرات کاربر

export async function getUserReviews( 
  userId:number 
): Promise<ReviewResponse[]> { 


  return apiGet<ReviewResponse[]>( 
    `/reviews/user/${userId}` 
  ); 


} 





// بررسی اینکه یک رزرو قبلاً Review دارد یا نه

export async function getBookingReview( 
  bookingId:number 
): Promise<ReviewResponse | null> { 


  return apiGet<ReviewResponse | null>( 
    `/reviews/booking/${bookingId}` 
  ); 


}