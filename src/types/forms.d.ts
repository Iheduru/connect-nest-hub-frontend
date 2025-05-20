
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
  role?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  password_confirmation: string;
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
  phone_number: string;
  alternative_email?: string;
  bio?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profile_picture?: File;
}

// KYC form types
export interface KycFormData {
  kyc_document: File;
  document_type: string;
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
