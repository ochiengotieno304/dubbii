

import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ReportInfringementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContentUrl: string;
  contentTitle: string;
}

export const ReportInfringementModal: React.FC<ReportInfringementModalProps> = ({
  isOpen,
  onClose,
  defaultContentUrl,
  contentTitle,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contentLink, setContentLink] = useState(defaultContentUrl);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContentLink(defaultContentUrl); // Update if URL changes while modal might be kept in DOM (though typically unmounted)
  }, [defaultContentUrl]);

  useEffect(() => {
    if (isOpen) {
      setSubmissionStatus('idle');
      setFormError(null);
      // Focus the first input element when the modal opens
      firstInputRef.current?.focus();

      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !contentLink.trim() || !description.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you'd send data to a backend here.
      console.log('DMCA Report Submitted:', { name, email, contentLink, description, contentTitle });
      setSubmissionStatus('success');
      // Optionally reset form fields
      setName('');
      setEmail('');
      // setContentLink(''); // Keep link as it's specific to the page
      setDescription('');
    } catch (error) {
      console.error('DMCA submission error:', error);
      setSubmissionStatus('error');
      setFormError('Could not submit your report. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      aria-modal="true"
      role="dialog"
      aria-labelledby="reportModalTitle"
    >
      <div
        ref={modalRef}
        className="bg-primary dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0"
        style={{ animationName: 'modalShowAnim', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="reportModalTitle" className="text-xl sm:text-2xl font-semibold text-neutral dark:text-gray-100">
            Report Copyright Infringement
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submissionStatus === 'success' ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral dark:text-gray-100 mb-2">Report Submitted Successfully!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your report. We will review it shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-secondary text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name / Company Name
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="report-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/70 text-neutral dark:text-gray-100 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Your Name or Company"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="report-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="report-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/70 text-neutral dark:text-gray-100 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="report-content-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link to Infringing Content
              </label>
              <input
                type="url"
                id="report-content-link"
                value={contentLink}
                onChange={(e) => setContentLink(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/70 text-neutral dark:text-gray-100 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g., https://dubbii-app.com/media/movie/movie1"
                disabled={isSubmitting}
              />
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is for the content: <strong className="text-neutral dark:text-gray-200">{contentTitle}</strong></p>
            </div>
            <div>
              <label htmlFor="report-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description of Claim
              </label>
              <textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/70 text-neutral dark:text-gray-100 border border-gray-300 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-secondary focus:border-secondary placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Please provide details about your claim, including the copyrighted work and how it is infringed."
                disabled={isSubmitting}
              ></textarea>
            </div>

            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">{formError}</p>
            )}
            
            {submissionStatus === 'error' && !formError && ( // General submission error
                 <p className="text-sm text-red-600 dark:text-red-400" role="alert">Could not submit your report. Please try again later.</p>
            )}


            <div className="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 dark:hover:bg-blue-700 focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <LoadingSpinner size="sm" color="text-white" /> : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-2.5 bg-gray-200 dark:bg-gray-600 text-neutral dark:text-gray-100 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
