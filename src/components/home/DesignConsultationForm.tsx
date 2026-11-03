'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function DesignConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: 'Living & Dining Duplex',
    projectType: 'Complete Residence Illumination',
    budget: '₹3,00,000 - ₹5,00,000',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFeedback(data.message || 'Consultation request received! Our lighting architect will connect with you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          roomType: 'Living & Dining Duplex',
          projectType: 'Complete Residence Illumination',
          budget: '₹3,00,000 - ₹5,00,000',
          message: '',
        });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to submit inquiry. Please verify your details.');
      }
    } catch {
      setStatus('error');
      setFeedback('Something went wrong. Please reach our studio directly at studio@thefifthwall.in.');
    }
  };

  return (
    <section id="consultation" className="py-24 bg-[#F6F3ED] border-t border-[#EAE3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-[#EAE3D8] p-8 sm:p-14 rounded-sm shadow-xl relative overflow-hidden">
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B69A69] via-[#D4C39E] to-[#B69A69]" />

          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 justify-center">
              <Sparkles className="w-4 h-4 text-[#B69A69]" />
              <span className="section-kicker mb-0">Bespoke Architectural Advisory</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-2">
              Let&apos;s Design Your <em>Space Together.</em>
            </h2>
            <p className="text-xs sm:text-sm text-[#78746D] mt-3 font-light leading-relaxed">
              Whether you are designing a private villa, penthouse suite, or bespoke hospitality space, collaborate with our studio for tailored lighting schemes and custom fabrications.
            </p>
          </div>

          {status === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#151515]">Enquiry Received with Gratitude</h3>
              <p className="text-xs text-[#555] max-w-md mx-auto leading-relaxed">{feedback}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="gold-button-outline py-2.5 px-6 text-xs mt-4"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="consultation-name" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    id="consultation-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Singhania"
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  />
                </div>

                <div>
                  <label htmlFor="consultation-email" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    id="consultation-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  />
                </div>

                <div>
                  <label htmlFor="consultation-phone" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="consultation-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98200 12345"
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="consultation-room-type" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Room Type *
                  </label>
                  <select
                    id="consultation-room-type"
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  >
                    <option value="Living & Dining Duplex">Living & Dining Duplex</option>
                    <option value="Master Bedroom Suite">Master Bedroom Suite</option>
                    <option value="Grand Double-Height Foyer">Grand Double-Height Foyer</option>
                    <option value="Kitchen Island & Bar">Kitchen Island & Bar</option>
                    <option value="Outdoor Terrace & Veranda">Outdoor Terrace & Veranda</option>
                    <option value="Entire Villa / Residence">Entire Villa / Residence</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="consultation-project-type" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Project Type *
                  </label>
                  <select
                    id="consultation-project-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  >
                    <option value="Complete Residence Illumination">Complete Residence Illumination</option>
                    <option value="Statement Lighting Upgrade">Statement Lighting Upgrade</option>
                    <option value="New Construction Villa">New Construction Villa</option>
                    <option value="Architect / Designer Collaboration">Architect / Designer Collaboration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="consultation-budget" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                    Estimated Budget *
                  </label>
                  <select
                    id="consultation-budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm"
                  >
                    <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                    <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                    <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                    <option value="₹10,00,000+">₹10,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="consultation-message" className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-2">
                  Tell Us About Your Space & Vision *
                </label>
                <textarea
                  id="consultation-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details such as ceiling height, finishes, architectural style, or specific questions..."
                  className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs px-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] transition rounded-sm resize-none"
                />
              </div>

              {feedback && status === 'error' && (
                <p className="text-xs text-[#b91c1c] text-center">{feedback}</p>
              )}

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="gold-button py-4 px-10 text-xs tracking-[0.2em] inline-flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Consultation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
