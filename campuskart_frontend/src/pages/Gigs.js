import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, MapPin, Phone, Plus, User, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Gigs = () => {
    const { user } = useContext(AuthContext);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // New Gig Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        contact_phone: ''
    });

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const res = await api.get('gigs/gigs/');
            setGigs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGig = async (e) => {
        e.preventDefault();
        try {
            await api.post('gigs/gigs/', formData);
            setShowModal(false);
            setFormData({ title: '', description: '', budget: '', contact_phone: '' });
            fetchGigs(); // Refresh list
        } catch (err) {
            alert("Failed to post gig");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Campus Gigs</h1>
                    <p className="text-gray-500">Earn pocket money by helping others.</p>
                </div>
                {user && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Plus size={20} /> Post a Gig
                    </button>
                )}
            </div>

            {/* Gigs List */}
            <div className="grid gap-4">
                {gigs.map((gig) => (
                    <div 
                        key={gig.id}
                        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                        <div className="flex-1">
                            <div className="flex justify-between md:justify-start items-center gap-4 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    ₹{gig.budget}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 md:w-3/4">{gig.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>{gig.poster_name}</span>
                                    {gig.poster_verified && <CheckCircle size={12} className="text-black" />}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{new Date(gig.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action - Contact */}
                        <div className="md:min-w-[200px] flex justify-end">
                            {user ? (
                                <a href={`tel:${gig.contact_phone}`} className="w-full md:w-auto bg-gray-100 text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                                    <Phone size={18} /> Call Details
                                </a>
                            ) : (
                                <div className="text-xs text-gray-400 italic">Login to view contact</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Gig Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Post a New Gig</h2>
                        <form onSubmit={handleCreateGig} className="space-y-4">
                            <input 
                                placeholder="Task Title (e.g. Need help moving)" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="number"
                                    placeholder="Budget (₹)" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
                                    value={formData.budget}
                                    onChange={e => setFormData({...formData, budget: e.target.value})}
                                    required
                                />
                                <input 
                                    placeholder="Your Phone Number" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
                                    value={formData.contact_phone}
                                    onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                                    required
                                />
                            </div>
                            <textarea 
                                rows={4}
                                placeholder="Describe specifically what you need done..." 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            ></textarea>
                            
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800">Post Gig</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gigs;
