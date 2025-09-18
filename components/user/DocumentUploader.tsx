
import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { HelmetRegistration, Document, DocumentType } from '../../types';
import { DOCUMENT_TYPES } from '../../constants';


const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


interface DocumentItemProps {
    doc: Document;
    onFileUpload: (docType: DocumentType, imageData: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ doc, onFileUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileUpload(doc.type, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {doc.uploaded ? <CheckCircleIcon /> : <UploadIcon />}
                <span className="font-medium">{doc.type}</span>
            </div>
            <div className="flex items-center space-x-3">
                {doc.imageData && (
                    <img src={doc.imageData} alt={`${doc.type} preview`} className="h-10 w-16 object-cover rounded-md" />
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    {doc.uploaded ? 'Change' : 'Upload'}
                </button>
            </div>
        </div>
    );
};


interface DocumentUploaderProps {
  registration: HelmetRegistration;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ registration }) => {
  const context = useContext(AppContext);

  const handleFileUpload = (docType: DocumentType, imageData: string) => {
    if (context && context.user) {
        context.updateDocument(context.user.id, docType, imageData);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Upload Documents</h3>
      <p className="text-sm text-gray-400 mb-6">Please upload all 5 required documents for verification.</p>
      <div className="space-y-4">
        {DOCUMENT_TYPES.map(docType => {
            const doc = registration.documents.find(d => d.type === docType);
            if (!doc) return null;
            return <DocumentItem key={doc.id} doc={doc} onFileUpload={handleFileUpload} />
        })}
      </div>
    </div>
  );
};

export default DocumentUploader;
