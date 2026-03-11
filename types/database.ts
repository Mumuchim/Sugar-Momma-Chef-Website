// types/database.ts
// Auto-mirror of your Supabase schema — update when schema changes

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type OrderStatus = 'pending' | 'deposit_paid' | 'in_progress' | 'ready' | 'completed' | 'cancelled'
export type BookingStatus = 'pending' | 'paid' | 'cancelled'
export type ClassLevel = 'beginner' | 'intermediate' | 'advanced' | 'all'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  slug: string
  title: string
  subtitle?: string
  story?: string
  banner_url?: string
  thumbnail_url?: string
  video_url?: string
  category: string
  difficulty: Difficulty
  prep_time_mins?: number
  cook_time_mins?: number
  total_time_mins?: number
  base_servings: number
  is_published: boolean
  is_premium: boolean
  collection_id?: string
  meta_keywords?: string[]
  created_at: string
  updated_at: string
  // Joined
  ingredients?: Ingredient[]
  instructions?: Instruction[]
  collection?: Collection
}

export interface Ingredient {
  id: string
  recipe_id: string
  sort_order: number
  quantity?: number
  unit?: string
  name: string
  notes?: string
}

export interface Instruction {
  id: string
  recipe_id: string
  step_number: number
  body: string
  photo_url?: string
}

export interface Collection {
  id: string
  slug: string
  title: string
  tagline?: string
  description?: string
  cover_url?: string
  price_php: number
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined
  recipes?: Recipe[]
  recipe_count?: number
}

export interface UserCollectionAccess {
  id: string
  user_id: string
  collection_id: string
  granted_at: string
  payment_ref?: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  occasion?: string
  event_date?: string
  notes?: string
  status: OrderStatus
  deposit_amount?: number
  total_amount?: number
  paymongo_ref?: string
  paymongo_checkout_url?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  title: string
  description?: string
  cover_url?: string
  level: ClassLevel
  schedule_date: string
  duration_hours?: number
  location?: string
  is_online: boolean
  meeting_link?: string
  price_php: number
  total_slots: number
  booked_slots: number
  is_published: boolean
  created_at: string
  updated_at: string
  available_slots?: number
}

export interface ClassBooking {
  id: string
  class_id: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  status: BookingStatus
  paymongo_ref?: string
  paymongo_checkout_url?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  created_at: string
}

// PayMongo types
export interface PayMongoPaymentIntent {
  id: string
  type: 'payment_intent'
  attributes: {
    amount: number
    currency: string
    status: 'awaiting_payment_method' | 'awaiting_next_action' | 'processing' | 'succeeded' | 'cancelled'
    description?: string
    metadata?: Record<string, string>
    client_key: string
    last_payment_error?: object
  }
}

export interface PayMongoCheckoutSession {
  id: string
  type: 'checkout_session'
  attributes: {
    billing: object
    cancel_url: string
    checkout_url: string
    client_key: string
    currency: string
    description?: string
    line_items: PayMongoLineItem[]
    metadata?: Record<string, string>
    payment_intent: PayMongoPaymentIntent
    reference_number: string
    send_email_receipt: boolean
    show_description: boolean
    show_line_items: boolean
    status: string
    success_url: string
  }
}

export interface PayMongoLineItem {
  amount: number
  currency: string
  description?: string
  images?: string[]
  name: string
  quantity: number
}

export interface PayMongoWebhookPayload {
  data: {
    id: string
    type: string
    attributes: {
      type: string
      livemode: boolean
      data: {
        id: string
        type: string
        attributes: {
          status: string
          metadata: Record<string, string>
          reference_number: string
          [key: string]: unknown
        }
      }
      previous_data: object
      created_at: number
      updated_at: number
    }
  }
}
