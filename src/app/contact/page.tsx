'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import DesignConsultationForm from '@/components/home/DesignConsultationForm';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to submit message.');
      }
    } catch {
      setError('Communication error. Please email studio@thefifthwall.in directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#151515] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B69A69] font-medium block">
            Begin A Conversation
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light">
            Contact & Showroom
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CFC0] max-w-xl mx-auto font-light leading-relaxed">
            Visit our Lucknow flagship gallery or connect with our architectural lighting team for bespoke residence commissions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Showroom (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 border border-[#EAE3D8] rounded-sm shadow-sm space-y-6">
              <h2 className="font-serif text-2xl text-[#151515] border-b border-[#EAE3D8] pb-3">
                Flagship Gallery
              </h2>

              <div className="space-y-4 text-xs text-[#555]">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-4 h-4 text-[#B69A69] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#151515] block uppercase tracking-wider text-[11px] mb-0.5">Address</strong>
                    <p>The Fifth Wall Showroom</p>
                    <p>1/803, Sector 1, Gomti Nagar Vistar</p>
                    <p>Lucknow, Uttar Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Clock className="w-4 h-4 text-[#B69A69] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#151515] block uppercase tracking-wider text-[11px] mb-0.5">Showroom Timings</strong>
                    <p>Monday – Saturday: 10:30 am – 8:00 pm</p>
                    <p className="text-[#8E7444]">Sunday: By Prior Appointment Only</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-4 h-4 text-[#B69A69] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#151515] block uppercase tracking-wider text-[11px] mb-0.5">Direct Correspondence</strong>
                    <p>General & Sales: studio@thefifthwall.in</p>
                    <p>Architectural Projects: projects@thefifthwall.in</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-4 h-4 text-[#B69A69] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#151515] block uppercase tracking-wider text-[11px] mb-0.5">Concierge Phone</strong>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisory Note */}
            <div className="bg-[#EAE3D8] p-6 rounded-sm border border-[#D9CFC0] text-xs space-y-2">
              <h3 className="font-serif text-base text-[#151515] font-normal">Architectural Inquiries</h3>
              <p className="text-[#666] leading-relaxed">
                We frequently collaborate with interior designers, architects, and estate builders on custom scaling, ceiling reinforcement, and dimming drivers.
              </p>
            </div>
          </div>

          {/* Right: Working Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-[#EAE3D8] rounded-sm shadow-sm">
            <h2 className="font-serif text-2xl text-[#151515] mb-2">
              Send a Note to Our Studio
            </h2>
            <p className="text-xs text-[#78746D] mb-6">
              Inquire regarding product specifications, custom finishes, or stock inquiries.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-[#151515]">Message Received</h3>
                <p className="text-xs text-[#78746D] max-w-sm mx-auto">
                  Thank you for writing to THE FIFTH WALL. Our showroom concierge will reply within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="gold-button-outline py-2.5 px-6 text-xs mt-3"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pooja Hegde"
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3.5 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="pooja@example.com"
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3.5 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98450 11223"
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3.5 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Custom finish inquiry"
                      className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3.5 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our design and lighting team assist you today?"
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-3.5 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm resize-none"
                  />
                </div>

                {error && <p className="text-xs text-[#b91c1c]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button py-3.5 px-8 text-xs tracking-[0.2em] flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Working Design Consultation Section */}
        <DesignConsultationForm />
      </div>
    </div>
  );
}
