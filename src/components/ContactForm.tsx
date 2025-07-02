import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="glass w-full max-w-2xl mx-auto rounded-2xl overflow-hidden">
      <div className="px-8 py-12 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
            Get In Touch
          </h2>
        </div>
        
        {submitted ? (
          <div className="text-center p-8 rounded-xl bg-green-100/10 text-[var(--foreground)]">
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p>I'll get back to you soon.</p>
          </div>
        ) : (
          <form
            className="space-y-8"
            onSubmit={e => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Name
                </label>
                <input 
                  required 
                  className="w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--accent)]/20 transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" 
                  type="text" 
                  name="name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Email
                </label>
                <input 
                  required 
                  className="w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--accent)]/20 transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none" 
                  type="email" 
                  name="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Message
                </label>
                <textarea 
                  required
                  className="w-full p-3 rounded-xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--accent)]/20 transition-all focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] outline-none min-h-[150px]" 
                  name="message"
                />
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="icy-button inline-block px-8 py-4 text-lg font-medium rounded-xl text-[var(--foreground)] shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
