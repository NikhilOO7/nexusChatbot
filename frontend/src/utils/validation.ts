// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation - at least 8 chars, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validators = {
  // Email validation
  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
    return null;
  },
  
  // Password validation
  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!PASSWORD_REGEX.test(value)) {
      return 'Password must include uppercase, lowercase, and numbers';
    }
    return null;
  },
  
  // Password confirmation validation
  passwordConfirm: (value: string, password: string): string | null => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },
  
  // Required field validation
  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
  },
  
  // Min length validation
  minLength: (value: string, min: number): string | null => {
    if (!value) return null; // Let required validation handle empty values
    if (value.length < min) return `Must be at least ${min} characters`;
    return null;
  },
  
  // Max length validation
  maxLength: (value: string, max: number): string | null => {
    if (!value) return null;
    if (value.length > max) return `Must be less than ${max} characters`;
    return null;
  },
  
  // URL validation
  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

// Helper function to validate a form field
export const validateField = (
  name: string,
  value: string,
  validations: Array<(value: string, ...args: any[]) => string | null>,
  args: any[] = []
): string | null => {
  for (const validation of validations) {
    const error = validation(value, ...args);
    if (error) return error;
  }
  return null;
};

// Helper for form validation
export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, Array<(value: string, ...args: any[]) => string | null>>,
  validationArgs: Record<string, any[]> = {}
): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};
  
  for (const [fieldName, validations] of Object.entries(validationRules)) {
    const value = formData[fieldName] || '';
    const args = validationArgs[fieldName] || [];
    errors[fieldName] = validateField(fieldName, value, validations, args);
  }
  
  return errors;
};