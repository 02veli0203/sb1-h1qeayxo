import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://knvsbzdxspeleaxnzylu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudnNiemR4c3BlbGVheG56eWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NzQ4MDAsImV4cCI6MjA1MDQ1MDgwMH0.example-anon-key'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  discount_percentage: number;
  category_id?: number;
  image_url?: string;
  additional_images: string[];
  video_urls: string[];
  pdf_urls: string[];
  featured: boolean;
  stock_quantity: number;
  sku?: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Banner {
  id: number;
  image_url: string;
  title?: string;
  subtitle?: string;
  link_url?: string;
  is_active: boolean;
  order_num: number;
  created_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  cart_items?: CartItem[];
}

export interface Favorite {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
  product?: Product;
}