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

    strengths: CustomerExperienceItem[];

    improvements: CustomerExperienceItem[];

  };

}



export interface CustomerExperienceItem {

  title: string;

  status: "strength" | "improvement";

  percentage: number;

  mentions: number;

  color: "green" | "red";

}