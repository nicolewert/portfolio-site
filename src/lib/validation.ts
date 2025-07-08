import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Zod schema for contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(320, 'Email address is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  company: z
    .string()
    .optional()
    .default('') // Honeypot field
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function validateContactForm(data: unknown): ValidationResult {
  // Check honeypot field first
  if (data && typeof data === 'object' && 'company' in data) {
    const companyField = (data as any).company
    if (companyField && typeof companyField === 'string' && companyField.trim() !== '') {
      return { isValid: false, errors: ['Invalid submission'] }
    }
  }

  // Validate with Zod
  const result = contactFormSchema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => err.message)
    return { isValid: false, errors }
  }

  return { isValid: true, errors: [] }
}

export function sanitizeInput(input: string): string {
  // First trim and enforce length limit
  let sanitized = input.trim().substring(0, 5000)
  
  // Use DOMPurify to sanitize - strips all HTML but preserves text content
  sanitized = DOMPurify.sanitize(sanitized, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true // Keep text content even when removing tags
  })
  
  // Additional safety: remove null bytes and most control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  return sanitized
}
