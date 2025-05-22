
// Authentication form types
export interface LoginFormData {
  email_or_username: string;
  password: string;
  verification_code?: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'host' | 'admin';
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface VerifyPasswordResetCodeFormData {
  email: string;
  verification_code: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface VerifyEmailFormData {
  email: string;
  verification_code: string;
}

export interface VerifyLoginCodeFormData {
  user_id: number;
  verification_code: string;
}

// Profile form types
export interface ProfileFormData {
  middle_name?: string;
  phone_number?: string;
  alternative_email?: string;
  bio?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  nationality?: string;
  dob?: string;
  company_name?: string;
  website?: string;
  profile_picture?: File;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

// Admin profile management types
export interface AdminUpdateProfileFormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: File;
  status?: 'active' | 'inactive';
  account_type?: string;
}

// KYC form types
export interface KycFormData {
  kyc_document: File;
  document_type: string;
}

export interface KycVerificationFormData {
  user_id: number;
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

// Property form types
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  type: string;
  mode: string;
  location: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  images?: File[];
}

// Search and filter types
export interface ProfileSearchParams {
  username?: string;
  account_type?: string;
  city?: string;
  verified_host?: boolean;
  page?: number;
}

export interface KycListParams {
  status?: 'pending' | 'approved' | 'rejected';
  per_page?: number;
  page?: number;
}

export interface AdminListProfilesParams {
  per_page?: number;
  status?: string;
  account_type?: string;
}
