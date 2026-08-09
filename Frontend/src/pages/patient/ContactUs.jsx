import React, { useState } from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import MainLayout from '../../layouts/MainLayout';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const ContactUs = () => {
  const token = localStorage.getItem('token');

  const content = (
      <div className="p-8 max-w-7xl mx-auto animate-fade-in mt-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Contact Support
        </h1>
        
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Contact Info Side */}
            <div className="md:w-2/5 bg-gradient-to-br from-indigo-900 to-purple-900 p-10 text-white flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <p className="text-indigo-200 mb-8">Fill up the form and our team will get back to you within 24 hours.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            </div>
                            <span>+91 9876543210</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            </div>
                            <span>support@telemedconnect.com</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="leading-snug">LPU, Jalandhar-Delhi G.T. Road Punjab, India 144411</span>
                                <a 
                                    href="https://maps.app.goo.gl/tyZBa3pR5KNT8wAL8" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-3 bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Set GPS
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 flex gap-4">
                        {/* Socials placeholder */}
                        <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                </div>
            </div>

            {/* Form Side */}
            <div className="md:w-3/5 p-10">
                <h3 className="text-2xl font-bold text-indigo-900 mb-6">Send us a Message</h3>
                <ContactForm />
            </div>
        </div>
      </div>
  );

  if (token) {
    return <MainLayout>{content}</MainLayout>;
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <PublicNavbar />
      {content}
    </div>
  );
};

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', formData);
            toast.success("Message sent successfully!");
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                        placeholder="John" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                        placeholder="Doe" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    placeholder="john@example.com" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all h-32 resize-none" 
                    placeholder="Write your message here..."
                ></textarea>
            </div>
            <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};


export default ContactUs;
