// Item types
export type ItemType = 'sell' | 'swap' | 'free' | 'rent';

export interface Item {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  type: ItemType;
  category: string;
  image_url: string | null;
  seller_id: string;
  status: string;
  rental_price_per_day: number | null;
  max_rental_days: number | null;
  created_at: string;
  updated_at: string;
  seller?: {
    id: string;
    email: string;
    avatar_url?: string | null;
  };
}

// User/Profile types
export interface Profile {
  id: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  phone_number: string | null;
  university_name: string | null;
  year_of_study: string | null;
  created_at: string;
  updated_at: string;
}

// Chat/Message types
export interface Chat {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  last_message_at: string | null;
  item?: Item;
  buyer?: Profile;
  seller?: Profile;
}

export interface Message {
  id: string;
  chat_id: string | null;
  item_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

// Rental types
export interface Rental {
  id: string;
  item_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  item?: Item;
  renter?: Profile;
  owner?: Profile;
}

// Favorite types
export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
  item?: Item;
}

// Wishlist types
export interface Wishlist {
  id: string;
  user_id: string;
  keyword: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Form types
export interface ListItemFormData {
  title: string;
  description: string;
  price: number;
  type: ItemType;
  category: string;
  imageFile?: File;
  rental_price_per_day?: number;
  max_rental_days?: number;
}
