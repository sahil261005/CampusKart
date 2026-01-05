import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Zap, ArrowRight, UserCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
            
            {/* 1. Hero Section (Top Part) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Campus<span className="text-black">Kart</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mb-10">
                    The smartest way to buy & sell on campus. <br/>
                    <span className="text-gray-900 font-medium">Verified Students. AI Powered. Secure.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/marketplace" className="px-8 py-4 bg-black text-white text-lg font-bold rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200">
                        Explore Marketplace <ArrowRight size={20} />
                    </Link>
                    <Link to="/sell" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-colors">
                        Sell an Item
                    </Link>
                </div>
            </div>

            {/* 2. Features Grid (Why use us?) */}
            <div className="bg-white py-20 px-4 border-t border-gray-100">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                    
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="bg-white p-4 rounded-full text-black border border-gray-200 mb-4 shadow-sm">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">AI-Powered Listing</h3>
                        <p className="text-gray-500">
                            Just take a photo. Our AI identifies your item, writes the title, and suggests a price instantly.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="bg-white p-4 rounded-full text-black border border-gray-200 mb-4 shadow-sm">
                            <UserCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Student Verified</h3>
                        <p className="text-gray-500">
                            Safe and secure. Join a community of verified students from your campus. No bots.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="bg-white p-4 rounded-full text-black border border-gray-200 mb-4 shadow-sm">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Quick Deals</h3>
                        <p className="text-gray-500">
                            Find textbooks, gadgets, and dorm essentials at student-friendly prices nearby.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
