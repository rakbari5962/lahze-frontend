export interface BusinessPublicProfile {

  business: {

    id: number;

    name: string;

    description?: string;

    phone?: string;

  };


  reputation: {

    business_id: number;

    total_reviews: number;

    average_rating?: string | null;

    customer_sentiment: {

      positive: number;

      neutral: number;

      negative: number;

    };

    model_version?: string;

  };


  customer_experience: {

    title: string;

    items: CustomerExperienceItem[];

  };

}




export interface CustomerExperienceItem {

  title: string;

  total_mentions: number;

  positive_mentions: number;

  negative_mentions: number;

  positive_percentage: number;

  negative_percentage: number;

  confidence?: string;

}





// API:
// GET /businesses/{business_id}/customer-insights

export interface CustomerInsightAttribute {

  attribute_id: number;

  key: string;

  label: string;

  total_mentions: number;

  positive_mentions: number;

  negative_mentions: number;

  positive_percentage: number;

  negative_percentage: number;

}





export interface CustomerInsightsResponse {

  business_id: number;

  summary: {

    total_attributes: number;

  };

  attributes: CustomerInsightAttribute[];

}





export interface BusinessReviewSummary {

  business_id: number;

  total_reviews: number;

  average_rating?: string | null;


  strengths: {

    name: string;

    label?: string;

    mentions: number;

    positive_mentions: number;

  }[];



  weaknesses: {

    topic: string;

    label: string;

    total_mentions: number;

    negative_mentions: number;

    negative_percentage: number;

    summary: string;

  }[];



  themes: {

    name: string;

    label?: string;

    mentions: number;

  }[];



  customer_sentiment: {

    positive: number;

    neutral: number;

    negative: number;

  };



  attribute_summary?: Record<string, any>;

  model_version?: string;

}


export interface CreateBusinessRequest {

  name: string;

  province_id: number;

  city_id: number;

  services: string[];

  description?: string | null;

  phone?: string | null;

}


export interface BusinessCreateResponse {

  id: number;

  name: string;

  owner_user_id: number;

  province_id: number;

  city_id: number;

  latitude: number | null;

  longitude: number | null;

  address: string | null;

  description: string | null;

  phone: string | null;

  status: string | null;

}


export type BusinessStatus =
  | "DRAFT"
  | "PROFILE_INCOMPLETE"
  | "READY"
  | "ACTIVE"
  | "SUSPENDED";


export interface BusinessListItem {

  id: number;

  name: string;

  owner_user_id: number;

  province_id: number;

  city_id: number;

  latitude: number | null;

  longitude: number | null;

  address: string | null;

  description: string | null;

  phone: string | null;

  status: BusinessStatus | null;

}


export type BusinessManagementResponse =
  BusinessListItem;


export interface BusinessCompletionResponse {

  business_id: number;

  completion_percentage: number;

  is_complete: boolean;

  missing_items: string[];

  completed_items: string[];

}


export interface BusinessProfileUpdate {

  description?: string | null;

  phone?: string | null;

}


export interface BusinessLocationUpdate {

  latitude: number;

  longitude: number;

  address?: string | null;

}


export interface BusinessServiceCreate {

  name: string;

  category?: string | null;

  duration_minutes?: number | null;

  price?: number | null;

  description?: string | null;

}


export interface BusinessServiceResponse {

  id: number;

  business_id: number;

  name: string;

  category: string | null;

  duration_minutes: number | null;

  price: number | null;

  description: string | null;

  is_active: boolean;

}