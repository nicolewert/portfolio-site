import { useState, useCallback } from 'react'
import { contactFormSchema } from '@/lib/validation'
import type { ZodError } from 'zod'

interface FormErrors {
  name?: string
  email?: string
  message?: string
  general?: string
}

interface ValidationState {
  errors: FormErrors
  isValid: boolean
  hasAttemptedSubmit: boolean
}

export function useFormValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    isValid: false,
    hasAttemptedSubmit: false,
  })

  const validateField = useCallback((name: string, value: string) => {
    try {
      // Validate individual field based on the field name
      if (name === 'name') {
        contactFormSchema.shape.name.parse(value)
      } else if (name === 'email') {
        contactFormSchema.shape.email.parse(value)
      } else if (name === 'message') {
        contactFormSchema.shape.message.parse(value)
      }

      // Clear error for this field
      setValidationState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: undefined },
      }))

      return true
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError
        const fieldError = zodError.issues[0]?.message || 'Invalid input'

        setValidationState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: fieldError },
        }))
      }
      return false
    }
  }, [])

  const validateForm = useCallback(
    (formData: {
      name: string
      email: string
      message: string
      company?: string
    }) => {
      try {
        contactFormSchema.parse(formData)

        setValidationState((prev) => ({
          ...prev,
          errors: {},
          isValid: true,
          hasAttemptedSubmit: true,
        }))

        return { isValid: true, errors: {} }
      } catch (error) {
        if (error instanceof Error && 'issues' in error) {
          const zodError = error as ZodError
          const errors: FormErrors = {}

          zodError.issues.forEach((issue) => {
            const field = issue.path[0] as string
            if (
              field &&
              field !== 'company' &&
              (field === 'name' || field === 'email' || field === 'message')
            ) {
              errors[field as keyof FormErrors] = issue.message
            }
          })

          setValidationState((prev) => ({
            ...prev,
            errors,
            isValid: false,
            hasAttemptedSubmit: true,
          }))

          return { isValid: false, errors }
        }

        return { isValid: false, errors: { general: 'Validation failed' } }
      }
    },
    []
  )

  const clearErrors = useCallback(() => {
    setValidationState({
      errors: {},
      isValid: false,
      hasAttemptedSubmit: false,
    })
  }, [])

  return {
    ...validationState,
    validateField,
    validateForm,
    clearErrors,
  }
}
