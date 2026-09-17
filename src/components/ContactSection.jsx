import { useState, forwardRef } from 'react';
import { Send, CheckCircle2, X } from 'lucide-react';
import Lanyard from './ui/Lanyard';
import cvImage from '../assets/CV.jpeg';
import { PROFILE_INFO } from '../data/profile';

const ContactSection = forwardRef(function ContactSection(props, ref) {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formState.name.trim()) errors.name = 'Name is required';
    if (!formState.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formState.subject.trim()) errors.subject = 'Subject is required';
    if (!formState.message.trim()) {
      errors.message = 'Message is required';
    } else if (formState.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const emailSubject = encodeURIComponent(formState.subject);
    const emailBody = encodeURIComponent(
      `Sender Name: ${formState.name}\n` +
      `Sender Email: ${formState.email}\n\n` +
      `Message:\n${formState.message}`
    );

    // Redirect to mailto
    window.location.href = `mailto:${PROFILE_INFO.email}?subject=${emailSubject}&body=${emailBody}`;

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });

      // Auto close success popup after 5s
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-28 w-full max-w-none relative mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
        {/* Left Side: 3D Interactive Lanyard Hanging Freely */}
        <div className="lg:col-span-6 w-full h-[540px] sm:h-[640px] lg:h-[760px] xl:h-[800px] relative flex items-center justify-center reveal-element-left">
          <Lanyard
            position={[0, 0, 11]}
            gravity={[0, -40, 0]}
            frontImage={cvImage}
            backImage={cvImage}
            imageFit="cover"
            lanyardWidth={1.3}
            nameLine1={PROFILE_INFO.name}
            nameLine2=""
            roleText={PROFILE_INFO.tagline}
            emailText={PROFILE_INFO.email}
            githubText={PROFILE_INFO.githubUsername}
          />
        </div>

        {/* Right Side: Minimalist Clean Contact Form */}
        <div className="lg:col-span-6 text-left reveal-element-right w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white mb-8 tracking-tight">
            Contact
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Your name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 py-2.5 text-base text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white focus:outline-none transition-colors"
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1 font-mono">{formErrors.name}</p>
              )}
            </div>

            {/* Your email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 py-2.5 text-base text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white focus:outline-none transition-colors"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1 font-mono">{formErrors.email}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 py-2.5 text-base text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white focus:outline-none transition-colors"
              />
              {formErrors.subject && (
                <p className="text-xs text-red-500 mt-1 font-mono">{formErrors.subject}</p>
              )}
            </div>

            {/* Your Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 py-2.5 text-base text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white focus:outline-none transition-colors min-h-[80px] resize-y"
              />
              {formErrors.message && (
                <p className="text-xs text-red-500 mt-1 font-mono">{formErrors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm flex items-center space-x-2 hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg disabled:opacity-75"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
              </button>

              <div className="flex space-x-3 text-sm text-neutral-500 font-mono">
                <a href={`mailto:${PROFILE_INFO.email}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {PROFILE_INFO.email}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* POPUP SUCCESS DIALOG */}
      {submitSuccess && (
        <div className="fixed bottom-6 right-6 z-[999] bg-neutral-900 border border-indigo-500/35 p-5 rounded-2xl shadow-2xl flex items-start space-x-4 max-w-sm animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Message Sent Successfully!</h4>
            <p className="text-xs text-neutral-400 mt-1">Thank you for your message, {PROFILE_INFO.name} will get back to you shortly.</p>
          </div>
          <button onClick={() => setSubmitSuccess(false)} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
});

export default ContactSection;
