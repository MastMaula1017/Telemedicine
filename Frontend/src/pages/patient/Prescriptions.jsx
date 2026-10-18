import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/ui/Card';
import useFetchData from '../../hooks/useFetchData';
import api from '../../utils/api';

const formatFrequency = (freq) => {
    if (!freq) return 'As directed';
    const clean = String(freq).trim();
    const map = {
        '1': 'Once daily (1-0-0)',
        '2': 'Twice a day (1-0-1)',
        '3': '3 times a day (1-1-1)',
        '4': '4 times a day (1-1-1-1)',
        '1-0-0': 'Once daily - Morning (1-0-0)',
        '0-0-1': 'Once daily - Night (0-0-1)',
        '1-0-1': 'Twice a day (1-0-1)',
        '1-1-1': '3 times a day (1-1-1)',
    };
    return map[clean] || clean;
};

const formatDuration = (dur) => {
    if (!dur) return '';
    const clean = String(dur).trim();
    if (/^\d+$/.test(clean)) {
        return `For ${clean} Days`;
    }
    if (/for/i.test(clean)) {
        return clean;
    }
    return `For ${clean}`;
};

const Prescriptions = () => {
    const { data, loading, error, refetch } = useFetchData('/user/prescription');
    const prescriptions = Array.isArray(data?.data) ? data.data : [];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this prescription?")) {
            try {
                await api.delete(`/prescription/${id}`);
                refetch();
            } catch (error) {
                console.error("Failed to delete prescription", error);
                alert("Failed to delete prescription");
            }
        }
    };

    return (
        <MainLayout>
             <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-slate-900">My Prescriptions</h1>
                <p className="text-slate-500 mt-2">View your digital prescriptions and treatment plans.</p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        Error loading prescriptions: {error}
                    </div>
                ) : prescriptions.length > 0 ? (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {prescriptions.map((presc) => (
                           <Card key={presc._id} className="relative overflow-hidden border-t-4 border-t-primary">
                               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h2v5h5v2h-5v5h-2v-5H7v-2h5V5z"/></svg>
                               </div>

                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <p className="text-sm text-slate-500">Prescribed by</p>
                                       <h3 className="text-lg font-bold text-slate-900">Dr. {presc.doctor?.userName || 'Unknown'}</h3>
                                       <p className="text-xs text-slate-400 mt-0.5">{new Date(presc.createdAt).toLocaleDateString()}</p>
                                   </div>
                                   {presc.followUpDate && (
                                       <div className="text-right">
                                           <p className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                                               Follow-up: {new Date(presc.followUpDate).toLocaleDateString()}
                                           </p>
                                       </div>
                                   )}
                               </div>

                               <div className="mb-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                                   <h4 className="text-xs font-bold text-slate-500 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                                       <span>💊</span> Prescribed Medicines
                                   </h4>
                                   <div className="space-y-2.5">
                                       {presc.medicines?.map((med, idx) => (
                                           <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                               <div className="flex items-center gap-2">
                                                   <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                                                   {med.dosage && (
                                                       <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                                           {med.dosage}
                                                       </span>
                                                   )}
                                               </div>
                                               <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                                   <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100 flex items-center gap-1">
                                                       <span>🕒</span> {formatFrequency(med.frequency)}
                                                   </span>
                                                   <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-100 flex items-center gap-1">
                                                       <span>📅</span> {formatDuration(med.duration)}
                                                   </span>
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               </div>

                               {presc.notes && (
                                   <div className="mb-4">
                                       <p className="text-sm text-slate-500 italic">"{presc.notes}"</p>
                                   </div>
                               )}
                                
                               <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                   <button 
                                        onClick={() => handleDelete(presc._id)}
                                        className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                       </svg>
                                       Delete
                                   </button>
                               </div>
                           </Card>
                       ))}
                   </div>
                ) : (
                    <div className="text-center py-12">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💊</div>
                        <p className="text-slate-500">No prescription found.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Prescriptions;
