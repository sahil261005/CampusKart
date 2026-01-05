import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Loader, ShoppingBag, MapPin, Trash2 } from 'lucide-react';

const Marketplace = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            // Updated URL: Just 'items/'
            const res = await api.get('items/');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`items/${itemId}/`);
                // Remove from list immediately
                setItems(items.filter(item => item.id !== itemId));
            } catch (err) {
                alert("Failed to delete item.");
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filter === 'All' || item.category === filter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                    <p className="text-gray-500 text-sm">Buy and sell with other students.</p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            placeholder="Search items..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:border-black outline-none"
                        />
                    </div>
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded focus:border-black outline-none cursor-pointer"
                    >
                        <option>All</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Clothing</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader className="animate-spin text-black" size={32} /></div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded border border-gray-200">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No items found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div 
                            key={item.id}
                            className="bg-white rounded border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group relative"
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm border border-gray-100">
                                    {item.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 truncate pr-2" title={item.title}>{item.title}</h3>
                                    <span className="text-black font-bold whitespace-nowrap">₹{item.price}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-3">{item.description}</p>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-black flex items-center justify-center text-[10px] font-bold">
                                            {item.seller_name?.[0] || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-gray-700">{item.seller_name}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1">
                                        {/* Show Delete button ONLY if current user is the seller */}
                                        {user && user.email === item.seller_email && (
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                                                title="Delete your item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        {/* Buy/Contact Button (always visible) */}
                                        <button className="text-black hover:bg-gray-100 p-2 rounded">
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
