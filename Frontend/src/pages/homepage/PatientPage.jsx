import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { toast } from 'react-hot-toast';
import PublicNavbar from "../../components/PublicNavbar";

export default function Dashboard() {
    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Doctor data
    const doctors = [
        {
            name: "Dr. Karthick N",
            credentials: "M.B.B.S, Medical Officer",
            location: "Dharmapur, Tamil Nadu",
            patients: "113,100+",
            image: "https://static.vecteezy.com/system/resources/previews/028/287/384/large_2x/a-mature-indian-male-doctor-on-a-white-background-ai-generated-photo.jpg"
        },
        {
            name: "Dr. K Suresh T",
            credentials: "M.B.B.S, Medical Officer",
            location: "Kanniyakumari, Tamil Nadu",
            patients: "100,500+",
            image: "https://wallpapers.com/images/hd/doctor-johnny-sins-6vleyqyzdu5tcn5c.jpg"
        },
        {
            name: "Dr. B. Ahmed Paizal",
            credentials: "M.B.B.S, General Physician",
            location: "Dindigul, Tamil Nadu",
            patients: "93,000+",
            image: "https://img.freepik.com/premium-photo/portrait-young-handsome-indian-man-doctor-white_251136-79251.jpg"
        },
        {
            name: "Dr. Priya Sharma",
            credentials: "M.D, Pediatrician",
            location: "Chennai, Tamil Nadu",
            patients: "87,500+",
            image: "https://thumbs.dreamstime.com/b/beautiful-female-doctor-portrait-stethoscope-standing-i-grey-background-62095626.jpg"
        },
        {
            name: "Dr. Rajesh Kumar",
            credentials: "M.S, Orthopedic Surgeon",
            location: "Coimbatore, Tamil Nadu",
            patients: "95,200+",
            image: "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA4L3Jhd3BpeGVsX29mZmljZV8yOV9waG90b19vZl9hZHVsdF9tYWxlX2luZGlhbl9kb2N0b3Jfc21pbGluZ19jb183ZTdhYzdmNC0xMjU0LTRkNjAtYmI2OS0zMTk3YTliZWRkZjJfMS5qcGc.jpg"
        },
        {
            name: "Dr. Meena Iyer",
            credentials: "M.D, Dermatologist",
            location: "Madurai, Tamil Nadu",
            patients: "78,900+",
            image: "https://tse1.mm.bing.net/th/id/OIP.EDzZakSU6l6ujRilCYiNdAHaLH?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
        }
    ];

    const [isTransitioning, setIsTransitioning] = useState(true);
    const extendedDoctors = [...doctors, ...doctors.slice(0, 3)]; // Clone first 3 for seamless loop

    // Handle seamless loop reset
    useEffect(() => {
        if (currentSlide === doctors.length) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(0);
            }, 500); // Wait for transition to finish
            return () => clearTimeout(timeout);
        }
        if (currentSlide === 0 && isTransitioning === false) {
            // Force reflow/next tick to re-enable transition
            const timeout = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [currentSlide, doctors.length, isTransitioning]);

    // Auto-scroll effect
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => prev + 1);
            }, 1500); // Faster speed (1.5s)

            return () => clearInterval(interval);
        }
    }, [isPaused]);

    const nextSlide = () => {
        if (currentSlide >= doctors.length) return; // Prevent double click during reset
        setCurrentSlide((prev) => prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? doctors.length - 1 : prev - 1));
    };

    return (
        <div className="font-sans text-slate-900 relative">
            {/* Navbar */}
            <PublicNavbar />

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white"
                style={{
                    backgroundImage: "url('/hero.jpeg')",
                    backgroundSize: "cover",
                }}
            >
                <div className="bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-indigo-900/80 animate-gradient px-10 py-28">
                    <h2 className="text-5xl font-extrabold mb-6 animate-slide-up">
                        Online Doctor Consultation Services
                    </h2>
                    <p className="text-xl max-w-3xl mb-8 animate-fade-in">
                        Connect with doctors online for timely and accessible medical care
                        from the comfort of your home through Telemed Connect.
                    </p>
                    <Link to="/signup">
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xl px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 animate-glow shadow-xl shadow-indigo-500/30">
                            Book Consultation
                        </button>
                    </Link>

                    <div className="flex items-center gap-4 mt-6 text-lg font-medium animate-fade-in">
                        <span className="animate-pulse-slow">⭐⭐⭐⭐⭐</span> Fast Consultations | Professional Care
                    </div>

                    <div className="flex items-center gap-3 mt-4 animate-slide-right">
                        <img
                            src="/user1.jpeg"
                            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                            alt="Audrey"
                        />
                        <p className="italic text-white font-semibold">
                            "Telemed Connect saved me so much time and hassle." – Audrey Flores
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-gradient-to-b from-indigo-50 to-white py-20 px-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN — Title & Subtitle */}
                    <div className="lg:col-span-1 animate-slide-right">
                        <h2 className="text-4xl font-bold mb-5 bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent">
                            Convenient Online Consultations
                        </h2>
                        <p className="text-lg text-gray-700">
                            Access professional medical care from anywhere, anytime.
                        </p>
                    </div>

                    {/* RIGHT COLUMN — Cards Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Card 1 */}
                        <div className="hover-lift bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:border-indigo-300 animate-fade-in group">
                            <div className="overflow-hidden">
                                <img
                                    src="/consult2.jpeg"
                                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-indigo-900 group-hover:text-indigo-600 transition-colors">Timely Medical Care</h3>
                                <p className="text-slate-600">
                                    Get quick consultations and medical advice, reducing waiting times and
                                    ensuring prompt treatment.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="hover-lift bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:border-indigo-300 animate-fade-in group" style={{ animationDelay: '0.1s' }}>
                            <div className="overflow-hidden">
                                <img
                                    src="/consult1.jpeg"
                                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-indigo-900 group-hover:text-indigo-600 transition-colors">Easy Access to Doctors</h3>
                                <p className="text-slate-600">
                                    Connect with experienced doctors instantly without the need to travel,
                                    saving time and effort.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="hover-lift bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:border-indigo-300 animate-fade-in group" style={{ animationDelay: '0.2s' }}>
                            <div className="overflow-hidden">
                                <img
                                    src="/consult3.jpeg"
                                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-indigo-900 group-hover:text-indigo-600 transition-colors">Flexible Appointments</h3>
                                <p className="text-slate-600">
                                    Schedule consultations at your convenience, making it easier to fit
                                    healthcare into your busy lifestyle.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="hover-lift bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:border-indigo-300 animate-fade-in group" style={{ animationDelay: '0.3s' }}>
                            <div className="overflow-hidden">
                                <img
                                    src="/doctor.jpeg"
                                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-indigo-900 group-hover:text-indigo-600 transition-colors">Expert Medical Advice</h3>
                                <p className="text-slate-600">
                                    Receive expert opinions and guidance from qualified doctors, ensuring
                                    accurate diagnosis and treatment.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our Doctors Section */}
            <section className="bg-gradient-to-b from-indigo-50 to-white py-20 px-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                        Our Doctors
                    </h2>

                    {/* Carousel Container */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Cards Container */}
                        <div className="overflow-hidden">
                            <div
                                className={`flex gap-8 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                style={{
                                    transform: `translateX(-${currentSlide * (100 / 3)}%)`
                                }}
                            >
                                {extendedDoctors.map((doctor, index) => (
                                    <div
                                        key={index}
                                        className="min-w-[calc(100%-2rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] hover-lift bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:border-indigo-300 group"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Doctor Image */}
                                            <img
                                                src={doctor.image}
                                                alt={doctor.name}
                                                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-indigo-900 mb-1 group-hover:text-indigo-600 transition-colors">{doctor.name}</h3>
                                                <p className="text-sm text-slate-600 mb-1">{doctor.credentials}</p>
                                                <p className="text-sm text-slate-500">{doctor.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-700 font-semibold bg-indigo-50 rounded-full px-4 py-2 shadow-sm border border-indigo-100">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm">{doctor.patients} Patients served</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-indigo-400 flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all hover:scale-110"
                                aria-label="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-indigo-400 flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all hover:scale-110"
                                aria-label="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>




            {/* Booking Section */}
            <section className="bg-gradient-to-b from-white to-indigo-50 py-24 flex justify-center px-6">
                <div className="bg-white shadow-2xl rounded-3xl p-12 max-w-3xl text-center border-2 border-transparent bg-gradient-to-r from-indigo-50 via-white to-indigo-50 hover-lift animate-scale-in">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-6">
                        Book Your Consultation Now.
                    </h2>
                    <p className="text-lg mb-10 italic text-slate-700">
                        "Telemed Connect has been a lifesaver for me. I can quickly consult
                        with doctors without having to leave my home. The service is reliable
                        and the doctors are always professional and caring." – Nora Wright
                    </p>
                    <Link to="/signup">
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xl px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 animate-glow shadow-xl shadow-indigo-500/30">
                            Book Consultation
                        </button>
                    </Link>
                </div>
            </section>


            {/* Testimonial */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 animate-slide-up">
                    <p className="text-3xl font-semibold max-w-3xl mx-auto px-6">
                        "Telemed Connect has made it incredibly easy for me to access medical
                        care whenever I need it."
                    </p>
                    <p className="mt-6 text-xl font-bold">Zoe Wilson</p>
                </div>
            </section>




            {/* About Us Section */}
            <section id="about" className="py-20 px-10 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-4">
                            About Us
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Revolutionizing healthcare delivery through technology, making quality medical advice accessible to everyone, everywhere.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start group hover:bg-indigo-50 p-4 rounded-xl transition-colors">
                                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Our Mission</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        To bridge the gap between patients and healthcare providers by offering a seamless, secure, and efficient telemedicine platform that saves time and saves lives.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group hover:bg-purple-50 p-4 rounded-xl transition-colors">
                                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <span className="text-2xl">👁️</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Our Vision</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        A world where quality healthcare is just a click away, regardless of geographical barriers or time constraints. We strive to be the most trusted virtual healthcare partner.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group hover:bg-blue-50 p-4 rounded-xl transition-colors">
                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <span className="text-2xl">🤝</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Our Values</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Integrity, Compassion, and Innovation drive everything we do. We put patient care and data security at the forefront of our operations.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl rotate-3 opacity-20 transform scale-105"></div>
                            <img 
                                src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg" 
                                alt="Medical Team" 
                                className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="py-24 px-10 bg-slate-50">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
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
                             <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                             <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                             <div className="w-8 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
                        </div>
                    </div>

                    <div className="md:w-3/5 p-10">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-6">Send us a Message</h3>
                        <ContactForm />
                    </div>
                </div>
            </section>

            <footer className="bg-slate-900 text-slate-300 py-16 border-t border-indigo-900/50">
                <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Telemed Connect
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Connecting you with top healthcare professionals from the comfort of your home. Your health, our priority.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors hover:translate-x-1 inline-block">Home</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors hover:translate-x-1 inline-block">Services</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors hover:translate-x-1 inline-block">About Us</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors hover:translate-x-1 inline-block">Find a Doctor</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>LPU, Jalandhar-Delhi G.T. Road,<br />Punjab, India 144411</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+91 9876543210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>support@telemedconnect.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-indigo-600 text-white transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-indigo-600 text-white transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-indigo-600 text-white transition-all hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.373c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-sm text-slate-500 mt-6">
                            © 2025 Telemed Connect. All rights reserved.
                        </p>
                    </div>

                </div>
            </footer>
        </div>
    );
}

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
                        placeholder="shridhar" 
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
                    placeholder="shridhar@example.com" 
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