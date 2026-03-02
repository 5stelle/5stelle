export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo_url: string | null
          social_links: Record<string, string> | null
          primary_platform: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          trial_ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          logo_url?: string | null
          social_links?: Record<string, string> | null
          primary_platform?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          social_links?: Record<string, string> | null
          primary_platform?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          created_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          is_active: boolean
          reward_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          is_active?: boolean
          reward_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          is_active?: boolean
          reward_text?: string | null
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          form_id: string
          type: QuestionType
          label: string
          description: string | null
          is_required: boolean
          options: Json | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          type: QuestionType
          label: string
          description?: string | null
          is_required?: boolean
          options?: Json | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          type?: QuestionType
          label?: string
          description?: string | null
          is_required?: boolean
          options?: Json | null
          order_index?: number
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          form_id: string
          table_identifier: string | null
          overall_sentiment: Sentiment | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          table_identifier?: string | null
          overall_sentiment?: Sentiment | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          table_identifier?: string | null
          overall_sentiment?: Sentiment | null
          completed_at?: string | null
          created_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          identifier: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          identifier: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          identifier?: string
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          value: Json
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          value: Json
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          value?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Custom types for better DX
export type QuestionType =
  | 'sentiment'
  | 'star_rating'
  | 'open_text'
  | 'multiple_choice'
  | 'single_choice'

export type Sentiment = 'bad' | 'ok' | 'great'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete'

// Helper types for easier access
export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert']
export type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update']

export type Form = Database['public']['Tables']['forms']['Row']
export type FormInsert = Database['public']['Tables']['forms']['Insert']
export type FormUpdate = Database['public']['Tables']['forms']['Update']

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

export type Submission = Database['public']['Tables']['submissions']['Row']
export type SubmissionInsert = Database['public']['Tables']['submissions']['Insert']
export type SubmissionUpdate = Database['public']['Tables']['submissions']['Update']

export type Answer = Database['public']['Tables']['answers']['Row']
export type AnswerInsert = Database['public']['Tables']['answers']['Insert']
export type AnswerUpdate = Database['public']['Tables']['answers']['Update']

export type Table = Database['public']['Tables']['tables']['Row']
export type TableInsert = Database['public']['Tables']['tables']['Insert']
export type TableUpdate = Database['public']['Tables']['tables']['Update']
