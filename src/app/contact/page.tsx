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
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
      {/* Header Banner */}
      <div className="bg-[#060606] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 border-b border-[#2E261B]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
            Begin A Conversation
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F5EEDB]">
            Contact & Showroom
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9788] max-w-xl mx-auto font-light leading-relaxed">
            Visit our Lucknow flagship gallery or connect with our architectural lighting team for bespoke residence commissions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Showroom (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#141414] p-8 border border-[#2E261B] rounded-sm shadow-2xl space-y-6">
              <h2 className="font-serif text-2xl text-[#F5EEDB] border-b border-[#2E261B] pb-3">
                Flagship Gallery
              </h2>

              <div className="space-y-4 text-xs text-[#9E9788]">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5EEDB] block uppercase tracking-wider text-[11px] mb-0.5">Address</strong>
                    <p>The Fifth Wall Showroom</p>
                    <p>E1/803, Vardan Khand, Sector 1, Gomti Nagar</p>
                    <p>Lucknow, Uttar Pradesh 226010, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5EEDB] block uppercase tracking-wider text-[11px] mb-0.5">Showroom Timings</strong>
                    <p>Monday – Saturday: 10:30 am – 8:00 pm</p>
                    <p className="text-[#C5A059]">Sunday: By Prior Appointment Only</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5EEDB] block uppercase tracking-wider text-[11px] mb-0.5">Direct Correspondence</strong>
                    <p>General & Sales: studio@thefifthwall.in</p>
                    <p>Architectural Projects: projects@thefifthwall.in</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5EEDB] block uppercase tracking-wider text-[11px] mb-0.5">Concierge Phone</strong>
                    <p>+91 91 98216 699</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <svg className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <div>
                    <strong className="text-[#F5EEDB] block uppercase tracking-wider text-[11px] mb-0.5">Instagram</strong>
                    <a
                      href="https://www.instagram.com/thefifthwall.lko?dlrf=MTM1ZGl2MDNsMHl6NA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A059] hover:text-[#E5C378] transition underline underline-offset-4"
                    >
                      @thefifthwall.lko
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisory Note */}
            <div className="bg-[#141414] p-6 rounded-sm border border-[#2E261B] text-xs space-y-2">
              <h3 className="font-serif text-base text-[#F5EEDB] font-normal">Architectural Inquiries</h3>
              <p className="text-[#9E9788] leading-relaxed">
                We frequently collaborate with interior designers, architects, and estate builders on custom scaling, ceiling reinforcement, and dimming drivers.
              </p>
            </div>
          </div>

          {/* Right: Working Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#141414] p-8 sm:p-10 border border-[#2E261B] rounded-sm shadow-2xl">
            <h2 className="font-serif text-2xl text-[#F5EEDB] mb-2">
              Send a Note to Our Studio
            </h2>
            <p className="text-xs text-[#9E9788] mb-6">
              Inquire regarding product specifications, custom finishes, or stock inquiries.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#181818] border border-[#C5A059] text-[#C5A059] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-[#F5EEDB]">Message Received</h3>
                <p className="text-xs text-[#9E9788] max-w-sm mx-auto">
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
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pooja Hegde"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="pooja@example.com"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98450 11223"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Custom finish inquiry"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our design and lighting team assist you today?"
                    className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm resize-none"
                  />
                </div>

                {error && <p className="text-xs text-[#f87171]">{error}</p>}

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
