
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { VerificationStatus } from '../../types';
import RegistrationForm from './RegistrationForm';
import DocumentUploader from './DocumentUploader';

const StatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const statusStyles = {
        [VerificationStatus.PENDING]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        [VerificationStatus.APPROVED]: 'bg-green-500/20 text-green-300 border-green-500/30',
        [VerificationStatus.REJECTED]: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const UserDashboard: React.FC = () => {
    const context = useContext(AppContext);

    if (!context || !context.user) {
        return <div className="text-center">Error: User not found.</div>;
    }

    const registration = context.getRegistrationForUser(context.user);

    if (!registration) {
        return <div className="text-center">Loading registration data...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Welcome, {registration.ownerName || context.user.email}</h2>
                    <p className="text-gray-400">Manage your helmet registration and documents.</p>
                </div>
                <div>
                    <span className="text-gray-400 mr-2">Verification Status:</span>
                    <StatusBadge status={registration.verificationStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RegistrationForm registration={registration} />
                <DocumentUploader registration={registration} />
            </div>
        </div>
    );
};

export default UserDashboard;
