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

    average_rating?: string;

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