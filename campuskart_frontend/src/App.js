import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import SellItem from './pages/SellItem';
import Gigs from './pages/Gigs';
import Wanted from './pages/Wanted';
import MyListings from './pages/MyListings';
import { AuthProvider } from './context/AuthContext';


import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
        <Router>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/sell" element={<SellItem />} />
                        <Route path="/gigs" element={<Gigs />} />
                        <Route path="/wanted" element={<Wanted />} />
                        <Route path="/dashboard" element={<MyListings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    </AuthProvider>
  );
}

export default App;
