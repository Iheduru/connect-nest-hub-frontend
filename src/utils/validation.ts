
import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object({
  email_or_username: yup.string().required('Email or username is required'),
  password: yup.string().required('Password is required'),
});

// Registration validation schema
export const registerSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Username cannot start with a number and can only contain letters, numbers, and underscores')
    .test('not-restricted', 'Username cannot contain restricted words', value => {
      const restrictedWords = ['admin', 'root', 'system'];
      return !restrictedWords.some(word => value?.toLowerCase().includes(word));
    }),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email')
    .test('not-disposable', 'Disposable emails are not allowed', value => {
      const disposableDomains = ['tempmail.com', 'throwaway.com'];
      return !disposableDomains.some(domain => value?.toLowerCase().includes(domain));
    }),
  first_name: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  middle_name: yup.string()
    .optional()
    .nullable()
    .matches(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes'),
  last_name: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .test('not-same-as-first', 'Last name cannot be identical to first name', function(value) {
      const { first_name } = this.parent;
      return value?.toLowerCase() !== first_name?.toLowerCase();
    }),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must not exceed 64 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .test('no-repeating', 'Password cannot have more than 2 repeated characters', value => {
      return !/(.)\1{2,}/.test(value || '');
    })
    .test('no-sequential', 'Password cannot have sequential numbers', value => {
      return !/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(value || '');
    })
    .test('not-common', 'Password is too common', value => {
      const commonPasswords = ['password123', '12345678', 'qwerty123'];
      return !commonPasswords.includes(value || '');
    })
    .test('not-contains-username', 'Password cannot contain username', function(value) {
      const { username } = this.parent;
      return !username || !value?.toLowerCase().includes(username.toLowerCase());
    }),
  password_confirmation: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup.string()
    .required('Role is required')
    .oneOf(['client', 'host', 'admin'], 'Invalid role'),
});

// Verification code schema
export const verificationCodeSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  verification_code: yup.string()
    .required('Verification code is required')
    .matches(/^\d{8}$/, 'Code must be exactly 8 digits'),
});

// Password reset request schema
export const forgotPasswordSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
});

// Password reset schema
export const resetPasswordSchema = yup.object({
  token: yup.string()
    .required('Verification code is required')
    .length(8, 'Code must be exactly 8 characters'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must not exceed 64 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  password_confirmation: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Profile update schema
export const profileUpdateSchema = yup.object({
  middle_name: yup.string().nullable(),
  phone_number: yup.string().nullable(),
  alternative_email: yup.string().email('Please enter a valid email').nullable(),
  bio: yup.string().nullable(),
  gender: yup.string().nullable(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  country: yup.string().nullable(),
});

// KYC submission schema
export const kycSubmissionSchema = yup.object({
  document_type: yup.string()
    .required('Document type is required')
    .oneOf(['passport', 'drivers_license', 'national_id', 'residence_permit'], 'Invalid document type'),
  kyc_document: yup.mixed()
    .required('Document file is required')
    .test('fileSize', 'File is too large', (value: any) => {
      return value && value.size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Unsupported file type', (value: any) => {
      return value && ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'application/pdf'].includes(value.type);
    }),
});

// Login code verification schema
export const verifyLoginCodeSchema = yup.object({
  user_id: yup.number().required('User ID is required'),
  verification_code: yup.string()
    .required('Verification code is required')
    .matches(/^\d{8}$/, 'Code must be exactly 8 digits'),
});
