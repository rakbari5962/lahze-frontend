export interface Opportunity {

  id: number;

  business_id: number;

  service_id: number;

  start_time: string;

  end_time: string;

  original_price: number;

  discount_percent: number;

  final_price: number;

  capacity: number;

  reserved_count: number;

  status: string;

}