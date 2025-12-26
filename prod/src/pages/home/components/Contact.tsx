
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formElement = e.target as HTMLFormElement;
      const formDataToSend = new FormData(formElement);
      
      const response = await fetch('https://readdy.ai/api/form/d4aj5ek8ldqdu8nb435h', {
        method: 'POST',
        body: new URLSearchParams(formDataToSend as any),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Ready to explore how our innovative technologies can benefit your organization? Let's start a conversation about collaboration opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-[#d4af37]">Canada Office</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37] mt-1">
                        <i className="ri-map-pin-line"></i>
                      </div>
                      <div className="text-gray-200">
                        <div>4 Low St.</div>
                        <div>Picton, ON K0K 2T0</div>
                        <div>Canada</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
                        <i className="ri-phone-line"></i>
                      </div>
                      <a href="tel:+16134030831" className="text-gray-200 hover:text-[#d4af37] transition-colors cursor-pointer">
                        +1 (613) 403-0831
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-[#d4af37]">Turkey Office</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37] mt-1">
                        <i className="ri-map-pin-line"></i>
                      </div>
                      <div className="text-gray-200">
                        <div>Çankaya, Ankara</div>
                        <div>Turkey</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
                        <i className="ri-phone-line"></i>
                      </div>
                      <a href="tel:+905551234567" className="text-gray-200 hover:text-[#d4af37] transition-colors cursor-pointer">
                        +90 555 123 4567
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-[#d4af37]">Digital Contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
                        <i className="ri-mail-line"></i>
                      </div>
                      <a href="mailto:info@imediacorp.com" className="text-gray-200 hover:text-[#d4af37] transition-colors cursor-pointer">
                        info@imediacorp.com
                      </a>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
                        <i className="ri-linkedin-fill"></i>
                      </div>
                      <a href="https://www.linkedin.com/in/bryandpersaud/" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-[#d4af37] transition-colors cursor-pointer">
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-[#d4af37]">Business Hours</h4>
              <div className="space-y-2 text-gray-200">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-[#1e3a5f]">Send Us a Message</h3>
            
            <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm cursor-pointer"
                >
                  <option value="">Select a subject</option>
                  <option value="Partnership Inquiry">Partnership Inquiry</option>
                  <option value="Research Collaboration">Research Collaboration</option>
                  <option value="Technology Licensing">Technology Licensing</option>
                  <option value="Clinical Trial Participation">Clinical Trial Participation</option>
                  <option value="IT Services">IT Services</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm resize-none"
                  placeholder="Tell us about your project, research interests, or how we can help..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-green-600">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <p className="text-green-800 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-red-600">
                    <i className="ri-error-warning-line text-xl"></i>
                  </div>
                  <p className="text-red-800 font-medium">
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
