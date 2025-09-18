
import React, { useState, useContext, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { HelmetRegistration, VerificationStatus } from '../../types';

const PoliceDashboard: React.FC = () => {
    const [helmetId, setHelmetId] = useState('');
    const [foundHelmet, setFoundHelmet] = useState<HelmetRegistration | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const context = useContext(AppContext);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setFoundHelmet(null);
        if (!helmetId.trim()) {
            setError('Please enter a Helmet ID.');
            return;
        }

        const result = context?.findRegistrationByHelmetId(helmetId.trim());
        if (result) {
            setFoundHelmet(result);
        } else {
            setError('No registration found for this Helmet ID.');
        }
    };
    
    const handleVerification = (status: VerificationStatus) => {
        if (context && foundHelmet) {
            context.updateVerificationStatus(foundHelmet.helmetId, status);
            setFoundHelmet(prev => prev ? {...prev, verificationStatus: status} : null);
            setMessage(`Registration has been ${status.toLowerCase()}.`);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Police Verification Portal</h2>
                <form onSubmit={handleSearch} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={helmetId}
                        onChange={(e) => setHelmetId(e.target.value)}
                        placeholder="Enter Helmet ID to verify..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                    >
                        Search
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            {foundHelmet && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
                    <h3 className="text-xl font-bold mb-6">Verification Details for Helmet: {foundHelmet.helmetId}</h3>
                    
                    {message && <p className="text-green-400 mb-4 p-3 bg-green-500/10 rounded-lg">{message}</p>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                            <p><strong className="text-gray-400">Owner:</strong> {foundHelmet.ownerName}</p>
                            <p><strong className="text-gray-400">Email:</strong> {foundHelmet.email}</p>
                        </div>
                        <div className="space-y-3">
                            <p><strong className="text-gray-400">Phone:</strong> {foundHelmet.phoneNumber}</p>
                            <p><strong className="text-gray-400">Bike Reg:</strong> {foundHelmet.bikeRegistration}</p>
                        </div>
                    </div>
                    
                    <h4 className="font-bold mb-4">Uploaded Documents</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {foundHelmet.documents.map(doc => (
                            <div key={doc.id} className="text-center">
                                <p className="text-sm font-medium mb-2">{doc.type}</p>
                                {doc.imageData ? (
                                    <img src={doc.imageData} alt={doc.type} className="w-full h-32 object-cover rounded-lg border-2 border-gray-600" />
                                ) : (
                                    <div className="w-full h-32 flex items-center justify-center bg-gray-700 rounded-lg text-xs text-gray-400">No Image</div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-6">
                        <span className="text-gray-400">Current Status: {foundHelmet.verificationStatus}</span>
                        <button 
                            onClick={() => handleVerification(VerificationStatus.APPROVED)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Approve
                        </button>
                        <button 
                             onClick={() => handleVerification(VerificationStatus.REJECTED)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoliceDashboard;
