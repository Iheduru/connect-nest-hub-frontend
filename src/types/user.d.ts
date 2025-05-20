
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  role: 'client' | 'host' | 'admin';
  is_verified: boolean;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  user_id: number;
  slug: string;
  bio?: string;
  phone_number?: string;
  alternative_email?: string;
  gender?: string;
  dob?: string;
  middle_name?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  company_name?: string;
  website?: string;
  profile_picture?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface KycVerification {
  id: number;
  user_id: number;
  document_type: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string;
}
