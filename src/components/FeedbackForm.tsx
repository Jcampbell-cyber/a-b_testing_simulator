import { useState } from 'react';
import { Send, Mail, AlertCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

export function FeedbackForm() {
  const [state, handleSubmit] = useForm("xdakpdye");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
            <p className="text-gray-300">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-[#0017D2]" />
            <h1 className="text-4xl font-bold text-white">Feedback & Enquiries</h1>
          </div>
          <p className="text-lg text-gray-300">
            Have questions or suggestions? We'd love to hear from you. Submit anonymously or include your contact info.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-8">
          {localError && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{localError}</p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              setLocalError(null);
              handleSubmit(e).catch((err) => {
                setLocalError('Failed to submit feedback. Please try again.');
                console.error('Error submitting form:', err);
              });
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent"
                placeholder="your.email@example.com"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent resize-none"
                placeholder="Your feedback or enquiry..."
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-[#0017D2] hover:bg-white hover:text-[#0017D2] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {state.submitting ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Feedback</>}
            </button>

            <p className="text-sm text-gray-400 text-center">
              Your feedback is stored securely and helps us improve
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
