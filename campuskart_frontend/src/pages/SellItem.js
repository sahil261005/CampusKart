
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
// Using standard icons only
import { Upload, Camera, Loader, CheckCircle, AlertCircle, IndianRupee, Tag, FileText } from 'lucide-react';

const SellItem = () => {
    const navigate = useNavigate();
    
    // --- State: Simple variables to hold our data ---
    const [image, setImage] = useState(null);      
    const [preview, setPreview] = useState(null);  
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        price_reasoning: ''
    });
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);  
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [aiError, setAiError] = useState('');              

    // --- Functions: Easy to read logic ---

    // 1. When user picks a file
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show perview
        setImage(file);
        setPreview(URL.createObjectURL(file));

        // Call AI function
        await analyzeImage(file);
    };

    // 2. The AI Analysis Function
    const analyzeImage = async (file) => {
        setIsAnalyzing(true);
        setAiError('');
        
        const form = new FormData();
        form.append('image', file);

        try {
            // Send to Backend
            const res = await api.post('analyze-image/', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const data = res.data;
            if (data.error) {
                setAiError(data.error);
            } else {
                // Update form with AI results
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.estimated_price || '',
                    category: data.category || 'Other',
                    price_reasoning: data.price_reasoning || ''
                });
            }
        } catch (err) {
            console.error(err);
            const serverMsg = err.response?.data?.error || 'Failed to analyze image.';
            setAiError(serverMsg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 3. Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('image', image);
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('category', formData.category);

        try {
            await api.post('items/', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/marketplace'); // Go back marketplace
        } catch (err) {
            alert('Failed to list item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row">
                
                {/* Left Side: Image Upload */}
                <div className="w-full md:w-2/5 bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center">
                    
                    {/* Image Box */}
                    <div className="w-full aspect-square relative bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <Camera size={48} className="mx-auto mb-2" />
                                <span>Click to Upload</span>
                            </div>
                        )}
                        
                        {/* Hidden Input */}
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*" 
                        />
                        
                        {/* Loading State */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                                <Loader className="animate-spin mb-2" />
                                <span>Analyzing...</span>
                            </div>
                        )}
                    </div>

                    {/* Simple Feedback Messages */}
                    <div className="mt-4 w-full">
                        {aiError && (
                            <div className="text-red-500 text-sm flex items-center gap-2">
                                <AlertCircle size={16} /> {aiError}
                            </div>
                        )}
                        
                        {formData.title && !isAnalyzing && (
                            <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">
                                <div className="flex items-center gap-2 font-bold">
                                    <CheckCircle size={16} /> 
                                    <span>AI Auto-filled!</span>
                                </div>
                                {formData.price_reasoning && (
                                    <p className="text-gray-600 text-xs mt-1">
                                        Note: {formData.price_reasoning}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Form Details */}
                <div className="w-full md:w-3/5 p-8">
                    <h2 className="text-2xl font-bold mb-6">Sell an Item</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                            <input 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                                placeholder="What are you selling?"
                                required
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select 
                                value={formData.category} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                            >
                                <option>Electronics</option>
                                <option>Books</option>
                                <option>Furniture</option>
                                <option>Clothing</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                            <input 
                                type="number"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none font-bold"
                                placeholder="0"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                                placeholder="Details about the item..."
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition"
                        >
                            {isSubmitting ? "Posting..." : "Post Item"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellItem;
