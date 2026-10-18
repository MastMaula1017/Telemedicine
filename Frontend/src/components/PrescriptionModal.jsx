import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const FREQUENCY_OPTIONS = [
    { label: "Select Frequency", value: "" },
    { label: "Twice a day (1-0-1)", value: "Twice a day (1-0-1)" },
    { label: "Three times a day (1-1-1)", value: "Three times a day (1-1-1)" },
    { label: "Once daily - Morning (1-0-0)", value: "Once daily - Morning (1-0-0)" },
    { label: "Once daily - Night (0-0-1)", value: "Once daily - Night (0-0-1)" },
    { label: "Four times a day", value: "Four times a day" },
    { label: "Every 8 hours", value: "Every 8 hours" },
    { label: "As needed (SOS)", value: "As needed (SOS)" },
    { label: "Custom / Other...", value: "custom" }
];

const DURATION_OPTIONS = [
    { label: "Select Duration", value: "" },
    { label: "3 Days", value: "3 Days" },
    { label: "5 Days", value: "5 Days" },
    { label: "7 Days (1 Week)", value: "7 Days" },
    { label: "10 Days", value: "10 Days" },
    { label: "14 Days (2 Weeks)", value: "14 Days" },
    { label: "1 Month", value: "1 Month" },
    { label: "Continuous / Ongoing", value: "Continuous" },
    { label: "Custom...", value: "custom" }
];

const PrescriptionModal = ({ isOpen, onClose, patientId, patientName }) => {
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    
    // Form States
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: 'Twice a day (1-0-1)', duration: '5 Days', customFrequency: '', customDuration: '' }
    ]);
    const [notes, setNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    useEffect(() => {
        if (isOpen && patientId) {
            fetchAppointments();
        }
    }, [isOpen, patientId]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/doctor');
            const appts = res.data.appointments || [];
            // Filter appointments for this patient
            const patientAppts = appts.filter(a => a.patient?._id === patientId || a.patient === patientId);
            
            // Sort by date descending
            patientAppts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setAppointments(patientAppts);
            if (patientAppts.length > 0) {
                // Default to the most recent appointment (accepted or completed preferred)
                const activeAppt = patientAppts.find(a => ['accepted', 'completed'].includes(a.status)) || patientAppts[0];
                setSelectedAppointmentId(activeAppt._id);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);
    };

    const addMedicineRow = () => {
        setMedicines([
            ...medicines, 
            { name: '', dosage: '', frequency: 'Twice a day (1-0-1)', duration: '5 Days', customFrequency: '', customDuration: '' }
        ]);
    };

    const removeMedicineRow = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppointmentId) {
            alert("No appointment found for this patient. Cannot create prescription.");
            return;
        }

        // Clean up medicines by resolving custom frequency/duration if chosen
        const formattedMedicines = medicines.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency === 'custom' ? (med.customFrequency || 'As directed') : med.frequency,
            duration: med.duration === 'custom' ? (med.customDuration || 'As needed') : med.duration
        }));

        setLoading(true);
        try {
            await api.post('/prescription/create', {
                appointmentId: selectedAppointmentId,
                notes,
                medicines: formattedMedicines,
                followUpDate
            });
            alert("Prescription created successfully!");
            onClose();
            // Reset form
            setMedicines([
                { name: '', dosage: '', frequency: 'Twice a day (1-0-1)', duration: '5 Days', customFrequency: '', customDuration: '' }
            ]);
            setNotes('');
            setFollowUpDate('');
        } catch (error) {
            console.error("Failed to create prescription", error);
            alert(error.response?.data?.message || "Failed to create prescription");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Write Prescription</h2>
                            <p className="text-xs text-slate-500">Add medications with clear dosages, frequency, and duration</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Patient Context */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Name</p>
                                <p className="font-bold text-slate-800 text-lg">{patientName}</p>
                            </div>
                        </div>
                        
                        <div className="mt-2">
                             <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Linked Appointment</label>
                             <select 
                                value={selectedAppointmentId}
                                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                required
                             >
                                <option value="" disabled>Select Appointment</option>
                                {appointments.map(appt => (
                                    <option key={appt._id} value={appt._id}>
                                        {new Date(appt.date).toLocaleDateString()} - {appt.timeSlot?.start} ({appt.status})
                                    </option>
                                ))}
                             </select>
                        </div>
                    </div>

                    {/* Medicines List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                             <div>
                                 <label className="text-base font-bold text-slate-800">Medicines</label>
                                 <p className="text-xs text-slate-500">Select clear frequency and duration so the patient understands easily</p>
                             </div>
                             <button 
                                type="button" 
                                onClick={addMedicineRow} 
                                className="px-3 py-1.5 bg-blue-50 text-primary border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                             >
                                <span>+</span> Add Another Medicine
                             </button>
                        </div>

                        <div className="space-y-4">
                            {medicines.map((med, index) => (
                                <div key={index} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl relative space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Medicine #{index + 1}
                                        </span>
                                        {medicines.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeMedicineRow(index)} 
                                                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Medicine Name */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                                Medicine Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                placeholder="e.g. Dolo 650, Amoxicillin" 
                                                value={med.name}
                                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                                required
                                            />
                                        </div>

                                        {/* Dosage */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                                Dosage / Strength <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                placeholder="e.g. 500mg, 1 Tablet, 5ml" 
                                                value={med.dosage}
                                                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Frequency Dropdown */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                                Frequency (How often) <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={med.frequency}
                                                onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none font-medium text-slate-700"
                                                required
                                            >
                                                {FREQUENCY_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            {med.frequency === 'custom' && (
                                                <input 
                                                    placeholder="Type custom frequency (e.g. alternate days)" 
                                                    value={med.customFrequency || ''}
                                                    onChange={(e) => handleMedicineChange(index, 'customFrequency', e.target.value)}
                                                    className="w-full mt-2 px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs outline-none"
                                                    required
                                                />
                                            )}
                                        </div>

                                        {/* Duration Dropdown */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                                                Duration (How long) <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={med.duration}
                                                onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none font-medium text-slate-700"
                                                required
                                            >
                                                {DURATION_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            {med.duration === 'custom' && (
                                                <input 
                                                    placeholder="Type custom duration (e.g. 21 Days)" 
                                                    value={med.customDuration || ''}
                                                    onChange={(e) => handleMedicineChange(index, 'customDuration', e.target.value)}
                                                    className="w-full mt-2 px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs outline-none"
                                                    required
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Instructions / Diet Advice</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[90px]"
                            placeholder="e.g. Take after meals with warm water. Drink plenty of fluids..."
                            required
                        ></textarea>
                    </div>

                    {/* Follow Up */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Next Follow-up Date (Optional)</label>
                        <input 
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Save & Issue Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;
