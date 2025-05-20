
import * as yup from 'yup';

// Register validation schema
export const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z]/, 'Username cannot start with a number')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .test('not-restricted', 'This username is not allowed', (value) => {
      const restricted = ['admin', 'root', 'system'];
      return !restricted.includes(value?.toLowerCase() || '');
    }),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email')
    .test('not-disposable', 'Disposable emails are not allowed', (value) => {
      const disposableDomains = ['tempmail.com', 'throwaway.com'];
      const domain = value?.split('@')[1];
      return !disposableDomains.includes(domain || '');
    }),
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .test('no-username', 'Password cannot contain your username', function (value) {
      const username = this.parent.username?.toLowerCase();
      return !username || !value?.toLowerCase().includes(username);
    })
    .test('no-repeats', 'Password cannot have more than 2 repeated characters', (value) => {
      return !/(.)(\1{2,})/g.test(value || '');
    })
    .test('no-sequences', 'Password cannot contain sequential numbers', (value) => {
      return !/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(value || '');
    }),
  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .oneOf(['client', 'host', 'admin'], 'Invalid role')
    .default('client'),
}).test('names-different', 'First and last names cannot be identical', function(values) {
  if (values.first_name && values.last_name && 
      values.first_name.toLowerCase() === values.last_name.toLowerCase()) {
    return this.createError({
      path: 'last_name',
      message: 'First and last names cannot be identical'
    });
  }
  return true;
});

// Login validation schema
export const loginSchema = yup.object({
  email_or_username: yup
    .string()
    .required('Email or username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

// Verification code validation schema
export const verificationCodeSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
  verification_code: yup
    .string()
    .required('Verification code is required')
    .matches(/^\d{8}$/, 'Verification code must be exactly 8 digits'),
});

// Login code verification schema
export const loginCodeSchema = yup.object({
  user_id: yup
    .number()
    .required('User ID is required'),
  verification_code: yup
    .string()
    .required('Verification code is required')
    .matches(/^\d{8}$/, 'Verification code must be exactly 8 digits'),
});

// Reset password request schema
export const resetPasswordRequestSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
});

// Reset password schema
export const resetPasswordSchema = yup.object({
  token: yup
    .string()
    .required('Token is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .test('no-repeats', 'Password cannot have more than 2 repeated characters', (value) => {
      return !/(.)(\1{2,})/g.test(value || '');
    })
    .test('no-sequences', 'Password cannot contain sequential numbers', (value) => {
      return !/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(value || '');
    }),
  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Profile update schema
export const profileUpdateSchema = yup.object({
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes'),
  phone_number: yup
    .string()
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  alternative_email: yup
    .string()
    .email('Must be a valid email'),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other', ''], 'Invalid gender'),
  dob: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),
  // Add other profile fields as needed
});

// KYC submit schema
export const kycSubmitSchema = yup.object({
  kyc_document: yup
    .mixed()
    .required('Document is required'),
  document_type: yup
    .string()
    .required('Document type is required')
    .oneOf(['passport', 'id_card', 'drivers_license'], 'Invalid document type'),
});
