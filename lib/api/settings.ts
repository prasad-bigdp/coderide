import { supabase } from '../supabase/config';

export interface SystemSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  maxFileSize: number;
  enableRegistration: boolean;
  enableNotifications: boolean;
  enableEmails: boolean;
  maintenanceMode: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
}

export async function getSettings(): Promise<SystemSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateSettings(settings: Partial<SystemSettings>) {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return data;
}