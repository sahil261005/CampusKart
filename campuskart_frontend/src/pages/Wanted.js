import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Target, TrendingUp, Plus } from 'lucide-react';

const Wanted = () => {
    const { user } = useContext(AuthContext);
    const [wants, setWants] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [title, setTitle] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchWants();
    }, []);

    const fetchWants = async () => {
        try {
            // Fix URL: /api/wanted-items/
            const res = await api.get('wanted-items/');
            setWants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            // Fix URL: /api/wanted-items/
            await api.post('wanted-items/', {
                title,
                min_price: minPrice,
                max_price: maxPrice
            });
            setTitle(''); setMinPrice(''); setMaxPrice('');
            fetchWants();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Error posting request';
            alert(msg);
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-8">
            {/* Left Side: The Feed */}
            <div className="flex-1">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">The Wanted Board 🎯</h1>
                    <p className="text-gray-500">See what others are looking for. Got it? Sell it!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wants.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary-200 transition-colors">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-400">posted by {item.user_email}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                    Budget: ₹{item.min_price} - ₹{item.max_price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Post Widget */}
            <div className="w-full md:w-80">
                <div className="sticky top-24">
                    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus className="bg-white/20 p-1 rounded-full" size={24} />
                            Request Item
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">Can't find what you need? Post a request and get notified when someone lists it.</p>
                        
                        {user ? (
                            <form onSubmit={handlePost} className="space-y-3">
                                <input 
                                    className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-colors"
                                    placeholder="What do you need?"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white/20"
                                        placeholder="Min ₹"
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        required
                                    />
                                    <input 
                                        className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white/20"
                                        placeholder="Max ₹"
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="w-full bg-white text-black font-bold py-3 rounded-md mt-2 hover:bg-gray-100 transition-colors">
                                    Post Request
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <p className="text-sm text-gray-400">Login to post requests</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wanted;
