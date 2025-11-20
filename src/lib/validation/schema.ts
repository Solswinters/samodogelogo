/**
 * Validation schemas
 */

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface ValidationSchema {
  [key: string]: ValidationRule[]
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string[]>
}

/**
 * Validate data against schema
 */
export function validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string[]> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    const fieldErrors: string[] = []

    for (const rule of rules) {
      if (!rule.validate(value)) {
        fieldErrors.push(rule.message)
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Common validation rules
 */
export const rules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: any) => value !== null && value !== undefined && value !== '',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string) => value?.length >= min,
    message: message || `Minimum length is ${min}`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string) => value?.length <= max,
    message: message || `Maximum length is ${max}`,
  }),

  email: (message = 'Invalid email address'): ValidationRule => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  url: (message = 'Invalid URL'): ValidationRule => ({
    validate: (value: string) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value: number) => value >= min,
    message: message || `Minimum value is ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value: number) => value <= max,
    message: message || `Maximum value is ${max}`,
  }),

  pattern: (pattern: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value: string) => pattern.test(value),
    message,
  }),

  custom: (validate: (value: any) => boolean, message: string): ValidationRule => ({
    validate,
    message,
  }),
}
