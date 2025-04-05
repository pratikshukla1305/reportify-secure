
import { supabase } from '@/integrations/supabase/client';

// SOS Alerts
export const submitSOSAlert = async (alertData: any) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([alertData])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const getUserSOSAlerts = async (userId: string) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .eq('reported_by', userId)
    .order('reported_time', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// KYC Verification
export const submitKycVerification = async (verificationData: any) => {
  const { data, error } = await supabase
    .from('kyc_verifications')
    .insert([verificationData])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const getUserKycStatus = async (email: string) => {
  const { data, error } = await supabase
    .from('kyc_verifications')
    .select('*')
    .eq('email', email)
    .order('submission_date', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    throw error;
  }
  
  return data;
};

// Advisories
export const getPublicAdvisories = async () => {
  const { data, error } = await supabase
    .from('advisories')
    .select('*')
    .order('issue_date', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Criminal Profiles
export const getWantedCriminals = async () => {
  const { data, error } = await supabase
    .from('criminal_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Cases
export const getPublicCases = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('case_date', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Criminal Tip Submission
export const submitCriminalTip = async (tipData: any) => {
  // You would need to create a criminal_tips table for this
  const { data, error } = await supabase
    .from('criminal_tips') // This table would need to be created
    .insert([tipData])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};
