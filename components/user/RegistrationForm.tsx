
import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { HelmetRegistration } from '../../types';

interface RegistrationFormProps {
  registration: HelmetRegistration;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ registration }) => {
  const [formData, setFormData] = useState({
    helmetId: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    bikeRegistration: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  const context = useContext(AppContext);

  useEffect(() => {
    if (registration) {
      setFormData({
        helmetId: registration.helmetId,
        ownerName: registration.ownerName,
        phoneNumber: registration.phoneNumber,
        email: registration.email,
        bikeRegistration: registration.bikeRegistration,
      });
    }
  }, [registration]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (context && context.user) {
      context.updateRegistrationDetails(context.user.id, formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const inputClass = "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Registration Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="helmetId" className="block text-sm font-medium text-gray-300 mb-1">Helmet ID</label>
          <input type="text" name="helmetId" id="helmetId" value={formData.helmetId} onChange={handleChange} className={inputClass} placeholder="e.g., SH-12345" />
        </div>
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-300 mb-1">Owner Name</label>
          <input type="text" name="ownerName" id="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass} placeholder="John Doe" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="123-456-7890" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} disabled />
        </div>
        <div>
          <label htmlFor="bikeRegistration" className="block text-sm font-medium text-gray-300 mb-1">Bike Registration No.</label>
          <input type="text" name="bikeRegistration" id="bikeRegistration" value={formData.bikeRegistration} onChange={handleChange} className={inputClass} placeholder="MH-12-AB-3456" />
        </div>
        <div className="flex justify-end items-center pt-2">
            {isSaved && <span className="text-green-400 mr-4 transition-opacity duration-300">Details saved!</span>}
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
            >
                Save Details
            </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
