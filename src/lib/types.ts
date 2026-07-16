export type Product = {
  id: string;
  name: string;
  category: string;
  price_label: string;
  description: string;
  image_url: string | null;
  emoji: string;
  available: boolean;
  featured: boolean;
  badge: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryPhoto = {
  id: string;
  url: string;
  caption: string;
  sort_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: boolean;
  stand_status: 'open' | 'closed';
  hours_today: string;
  visitor_note: string;
  business_name: string;
  address: string;
  address_note: string;
  hours_text: string;
  payment_note: string;
  phone: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  nextdoor_url: string;
  other_social_url: string;
  about_lead: string;
  about_body_1: string;
  about_body_2: string;
  updated_at: string;
};

export type OrderType = 'reserve' | 'custom' | 'message';
export type OrderStatus = 'new' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  order_type: OrderType;
  subject: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_notes: string;
  custom_request: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price_label: string;
  quantity: number;
  created_at: string;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };
