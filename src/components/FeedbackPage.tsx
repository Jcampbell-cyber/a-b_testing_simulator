// import { useState } from 'react';
// import { Mail, Send, AlertCircle } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

// export function FeedbackPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const { error: submitError } = await supabase
//         .from('feedback')
//         .insert([
//           {
//             name: name.trim() || null,
//             email: email.trim() || null,
//             message: message.trim(),
//           },
//         ]);

//       if (submitError) throw submitError;

//       setSubmitted(true);
//       setName('');
//       setEmail('');
//       setMessage('');

//       setTimeout(() => setSubmitted(false), 5000);
//     } catch (err) {
//       setError('Failed to submit feedback. Please try again.');
//       console.error('Error submitting feedback:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="mb-8">
//             <div className="flex items-center gap-3 mb-2">
//               <Mail className="w-8 h-8 text-[#0017D2]" />
//               <h1 className="text-4xl font-bold text-white">Feedback & Enquiries</h1>
//             </div>
//             <p className="text-lg text-gray-300">
//               Have questions or suggestions? We'd love to hear from you. Submit anonymously or include your contact info.
//             </p>
//           </div>

//           <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-8">
//             {submitted ? (
//               <div className="bg-emerald-900 border border-emerald-700 rounded-lg p-6 text-center">
//                 <div className="flex justify-center mb-4">
//                   <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
//                     <Send className="w-8 h-8 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
//                 <p className="text-gray-300">
//                   Your feedback has been submitted successfully. We appreciate your input!
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {error && (
//                   <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//                     <p className="text-red-200">{error}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
//                     Name <span className="text-gray-500">(optional)</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent"
//                     placeholder="Your name"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
//                     Email <span className="text-gray-500">(optional)</span>
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     required
//                     rows={6}
//                     className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0017D2] focus:border-transparent resize-none"
//                     placeholder="Your feedback or enquiry..."
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-[#0017D2] hover:bg-white hover:text-[#0017D2] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     'Submitting...'
//                   ) : (
//                     <>
//                       <Send className="w-5 h-5" />
//                       Submit Feedback
//                     </>
//                   )}
//                 </button>

//                 <p className="text-sm text-gray-400 text-center">
//                   Your feedback is stored securely and helps us improve
//                 </p>
//               </form>
//             )}
//           </div>

//           <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-white mb-3">Common Questions</h3>
//             <div className="space-y-3 text-sm text-gray-300">
//               <div>
//                 <p className="font-medium text-white">How do I interpret the simulation results?</p>
//                 <p className="text-gray-400 mt-1">
//                   Each simulator shows how different testing approaches affect your A/B test outcomes. Look for the key metrics displayed at the top of the results section.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-medium text-white">Can I use these calculators for my business?</p>
//                 <p className="text-gray-400 mt-1">
//                   Yes! These tools are designed to help data scientists and product managers understand A/B testing methodology. Use them to validate your testing approach.
//                 </p>
//               </div>
//               <div>
//                 <p className="font-medium text-white">Are my simulation parameters saved?</p>
//                 <p className="text-gray-400 mt-1">
//                   Currently, parameters are not saved between sessions. We recommend noting down configurations that work well for your use case.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
