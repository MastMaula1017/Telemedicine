import React, { useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import api from '../utils/api';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
    const { data: freshDoctorData, loading: fetchingDoctor } = useFetchData(`/doctor/${doctor._id}`);
    
    // Use fresh data if available, otherwise fallback to prop (but fresh is preferred for slots)
    const activeDoctor = freshDoctorData?.data || doctor;

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0); // Percentage
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        setCouponMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/coupons/validate', { code: couponCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setDiscount(res.data.discountPercentage);
                setIsCouponApplied(true);
                setCouponMessage(`Coupon applied! You save ${res.data.discountPercentage}%`);
            }
        } catch (err) {
            console.error(err);
            setDiscount(0);
            setIsCouponApplied(false);
            setCouponMessage(err.response?.data?.message || 'Invalid coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    // Filter available days that actually have slots
    const availableDays = activeDoctor.availableTimes?.filter(day => day.slots && day.slots.length > 0) || [];

    const getNextDateForDay = (dayName) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(dayName);
        if (dayIndex === -1) return null;

        const today = new Date();
        const todayIndex = today.getDay();
        
        let daysUntil = dayIndex - todayIndex;
        if (daysUntil <= 0) {
            daysUntil += 7; // Target next occurrence
        }

        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntil);
        return nextDate; // Return Date object
    };

    const handleBook = async () => {
        if (!selectedDay || !selectedSlot) return;

        setBookingLoading(true);
        setError('');

        try {
            const dateObj = getNextDateForDay(selectedDay.day);
            const dateStr = dateObj ? dateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

            const payload = {
                doctorId: activeDoctor.userId?._id || activeDoctor.userId || activeDoctor._id,
                date: dateStr,
                day: selectedDay.day,
                timeSlot: {
                    start: selectedSlot.startTime,
                    end: selectedSlot.endTime
                },
                couponCode: isCouponApplied ? couponCode : null
            };

            await api.post('/appointments/book', payload);
            if (onSuccess) onSuccess();
            onClose();

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const finalPayAmount = Math.round(activeDoctor.consultationFee - (activeDoctor.consultationFee * discount) / 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                        <p className="text-sm text-slate-500">Dr. {activeDoctor.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {fetchingDoctor ? (
                         <div className="flex justify-center py-8">
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                         </div>
                    ) : (
                        <>
                            {/* Step 1: Select Day */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Day</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableDays.length > 0 ? (
                                        availableDays.map((timeObj, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setSelectedDay(timeObj); setSelectedSlot(null); }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedDay === timeObj
                                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {timeObj.day}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">
                                            <p className="text-sm text-slate-500 font-medium">No slots available</p>
                                            <p className="text-xs text-slate-400 mt-1">This doctor usually has no open slots. Check back later.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Select Slot */}
                            {selectedDay && (
                                <div className="mb-8 animate-fade-in">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Available Slots for {selectedDay.day} 
                                        <span className="font-normal text-slate-400 ml-2">
                                            ({getNextDateForDay(selectedDay.day)?.toLocaleDateString()})
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedDay.slots.map((slot, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-center ${
                                                    selectedSlot === slot
                                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                                }`}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Coupon Section */}
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Have a Coupon?</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        type="text" 
                                        placeholder="Enter code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={isCouponApplied}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                                    />
                                    {!isCouponApplied ? (
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || validatingCoupon}
                                            className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors"
                                        >
                                            {validatingCoupon ? 'Checking...' : 'Apply'}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setIsCouponApplied(false);
                                                setDiscount(0);
                                                setCouponCode('');
                                                setCouponMessage('');
                                            }}
                                            className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {couponMessage && (
                                    <p className={`text-xs font-medium mb-3 ${isCouponApplied ? 'text-green-600' : 'text-red-500'}`}>
                                        {couponMessage}
                                    </p>
                                )}

                                {/* Price Breakdown */}
                                <div className="space-y-2 pt-3 border-t border-slate-200">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Consultation Fee</span>
                                        <span>₹{activeDoctor.consultationFee}</span>
                                    </div>
                                    {isCouponApplied && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Discount ({discount}%)</span>
                                            <span>-₹{Math.round((activeDoctor.consultationFee * discount) / 100)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-bold text-slate-800 pt-1">
                                        <span>Total Consultation Fee</span>
                                        <span className="text-green-600 font-extrabold">₹{finalPayAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBook}
                                    disabled={!selectedDay || !selectedSlot || bookingLoading}
                                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center w-full"
                                >
                                    {bookingLoading ? (
                                        <>
                                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                            <span>Booking...</span>
                                        </>
                                    ) : (
                                        <span>Confirm Booking</span>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
