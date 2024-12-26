export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'faculty' | 'student'
          batch_id?: string
          created_at?: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'admin' | 'faculty' | 'student'
          batch_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'faculty' | 'student'
          batch_id?: string
          created_at?: string
        }
      }
      // Add other table definitions here
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