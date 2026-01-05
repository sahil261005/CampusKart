import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Menu, X, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Helper to check active link
    const isActive = (path) => location.pathname === path ? "text-black font-bold" : "text-gray-600 hover:text-black";

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-black p-2 rounded text-white">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="font-bold text-xl text-gray-900">
                            Campus<span className="text-black">Kart</span>
                        </span>
                    </Link>

                    {/* Desktop Menu (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/marketplace" className={isActive('/marketplace')}>Marketplace</Link>
                        <Link to="/gigs" className={isActive('/gigs')}>Campus Gigs</Link>
                        <Link to="/wanted" className={isActive('/wanted')}>Wanted Board</Link>
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Sell Button */}
                                <Link to="/sell" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                                    <PlusCircle size={18} />
                                    <span>Sell Item</span>
                                </Link>
                                
                                {/* User Profile */}
                                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                                    <Link to="/dashboard" className="flex items-center gap-2">
                                        <img 
                                            src={user.profile_picture || "https://ui-avatars.com/api/?name=" + user.first_name} 
                                            alt="Profile" 
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                                    </Link>
                                    <button onClick={logout} className="text-gray-400 hover:text-red-500">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Login</Link>
                                <Link to="/register" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/marketplace" className="block py-2 text-gray-700 hover:text-black">Marketplace</Link>
                        <Link to="/gigs" className="block py-2 text-gray-700 hover:text-black">Campus Gigs</Link>
                        <Link to="/wanted" className="block py-2 text-gray-700 hover:text-black">Wanted Board</Link>
                        
                        <div className="border-t border-gray-100 my-2 pt-2">
                            {user ? (
                                <>
                                    <Link to="/sell" className="block py-2 text-black font-bold">Sell an Item</Link>
                                    <Link to="/dashboard" className="block py-2 text-gray-600">My Dashboard</Link>
                                    <button onClick={logout} className="block w-full text-left py-2 text-red-500">Logout</button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" className="block py-2 text-center border border-gray-200 rounded">Login</Link>
                                    <Link to="/register" className="block py-2 text-center bg-black text-white rounded">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
