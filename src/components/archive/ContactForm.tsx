'use client'
import { useState } from 'react'
import { useFormValidation } from '@/hooks/useFormValidation'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    company: '', // honeypot field
  })

  const { errors, validateField, validateForm, hasAttemptedSubmit } =
    useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before proceeding
    const validation = validateForm(formData)
    if (!validation.isValid) {
      return // Errors will be displayed by the validation hook
    }

    // Check localStorage throttling
    const lastSubmission = localStorage.getItem('lastContactSubmission')
    if (lastSubmission) {
      const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission)
      const cooldownPeriod = 5 * 60 * 1000 // 5 minutes

      if (timeSinceLastSubmission < cooldownPeriod) {
        setError('Please wait a few minutes before submitting another message.')
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        // If we have field-specific errors from the API, handle them differently
        if (data.fieldErrors && Array.isArray(data.fieldErrors)) {
          setError(data.fieldErrors.join(', '))
        } else {
          throw new Error(data.error || 'Something went wrong')
        }
        return
      }

      // Success
      setSubmitted(true)
      localStorage.setItem('lastContactSubmission', Date.now().toString())
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Only validate field on change if user has attempted submit AND this field has an existing error
    if (
      hasAttemptedSubmit &&
      name !== 'company' &&
      errors[name as keyof typeof errors]
    ) {
      validateField(name, value)
    }
  }

  return (
    <div className="glass w-full max-w-2xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold animate-shiny">
            Get In Touch
          </h2>
        </div>

        {submitted ? (
          <div className="text-center p-8 rounded-xl bg-green-100/10 text-[var(--foreground)]">
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p>I&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="text-center p-4 rounded-xl bg-red-100/10 text-red-400 border border-red-400/20">
                {error}
              </div>
            )}

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
                overflow: 'hidden',
              }}
              tabIndex={-1}
              autoComplete="new-password"
              aria-hidden="true"
            />

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Name
                </label>
                <input
                  required
                  className={`w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none ${
                    errors.name ? 'border-red-400' : 'border-[var(--accent)]/20'
                  }`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Email
                </label>
                <input
                  required
                  className={`w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none ${
                    errors.email
                      ? 'border-red-400'
                      : 'border-[var(--accent)]/20'
                  }`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Message
                </label>
                <textarea
                  required
                  className={`w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none min-h-[150px] ${
                    errors.message
                      ? 'border-red-400'
                      : 'border-[var(--accent)]/20'
                  }`}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                )}
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`icy-button inline-block px-8 py-4 text-lg font-medium rounded-xl text-[var(--foreground)] shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
