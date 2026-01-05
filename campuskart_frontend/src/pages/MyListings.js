import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Briefcase, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [itemsRes, gigsRes] = await Promise.all([
                api.get('marketplace/items/?my_items=true'),
                api.get('gigs/gigs/?my_gigs=true')
            ]);
            setItems(itemsRes.data);
            setGigs(gigsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await api.delete(`marketplace/items/${id}/`);
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleDeleteGig = async (id) => {
        if (!window.confirm("Delete this gig?")) return;
        try {
            await api.delete(`gigs/gigs/${id}/`);
            setGigs(gigs.filter(g => g.id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    if (!user) return <div className="p-10 text-center">Please login to view your dashboard.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            
            {/* My Items Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="text-primary-600" /> My Items for Sale
                </h2>
                {items.length === 0 ? (
                    <p className="text-gray-500 italic">You haven't listed any items yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <motion.div layout key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                    <p className="text-primary-600 font-bold mb-2">₹{item.price}</p>
                                    <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Gigs Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="text-indigo-600" /> My Posted Gigs
                </h2>
                {gigs.length === 0 ? (
                    <p className="text-gray-500 italic">You haven't posted any gigs yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gigs.map(gig => (
                            <motion.div layout key={gig.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{gig.title}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">₹{gig.budget}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{gig.description}</p>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => handleDeleteGig(gig.id)}
                                        className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                        <Trash2 size={16} /> Delete Gig
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListings;
