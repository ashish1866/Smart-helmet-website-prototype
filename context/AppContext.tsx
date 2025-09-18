
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { HelmetRegistration, User, VerificationStatus, DocumentType } from '../types';
import { DOCUMENT_TYPES } from '../constants';

interface AppContextType {
  user: User | null;
  loading: boolean;
  registrations: HelmetRegistration[];
  login: (email: string) => void;
  logout: () => void;
  register: (email: string) => void;
  getRegistrationForUser: (user: User) => HelmetRegistration | undefined;
  updateRegistrationDetails: (userId: string, details: Partial<Omit<HelmetRegistration, 'id' | 'documents' | 'verificationStatus'>>) => void;
  updateDocument: (userId: string, docType: DocumentType, imageData: string) => void;
  findRegistrationByHelmetId: (helmetId: string) => HelmetRegistration | undefined;
  updateVerificationStatus: (helmetId: string, status: VerificationStatus) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const MOCK_DATA_KEY = 'smartHelmetMockData';
const MOCK_USER_KEY = 'smartHelmetMockUser';

const createInitialRegistration = (user: User): HelmetRegistration => ({
  id: user.id,
  helmetId: '',
  ownerName: '',
  phoneNumber: '',
  email: user.email,
  bikeRegistration: '',
  documents: DOCUMENT_TYPES.map(type => ({ id: `${user.id}-${type}`, type, imageData: null, uploaded: false })),
  verificationStatus: VerificationStatus.PENDING,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<HelmetRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      const storedData = localStorage.getItem(MOCK_DATA_KEY);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedData) {
        setRegistrations(JSON.parse(storedData));
      } else {
        // Add a default police user and a sample user for demonstration
        const policeUser = { id: 'police-001', email: 'officer@police.gov' };
        const sampleUser = { id: 'user-001', email: 'test@example.com' };
        
        const initialPoliceReg = createInitialRegistration(policeUser);
        const sampleReg = {
            ...createInitialRegistration(sampleUser),
            helmetId: "SH-12345",
            ownerName: "John Doe",
            phoneNumber: "123-456-7890",
            bikeRegistration: "MH-12-AB-3456",
            verificationStatus: VerificationStatus.PENDING,
        }
        setRegistrations([initialPoliceReg, sampleReg]);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(!loading) {
        localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(registrations));
    }
  }, [registrations, loading]);

  const login = useCallback((email: string) => {
    setLoading(true);
    const existingUser = registrations.find(r => r.email === email);
    if (existingUser) {
      const loggedInUser = { id: existingUser.id, email: existingUser.email };
      setUser(loggedInUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(loggedInUser));
    } else {
        alert("User not found. Please register first.");
    }
    setLoading(false);
  }, [registrations]);

  const register = useCallback((email: string) => {
      setLoading(true);
      if (registrations.some(r => r.email === email)) {
          alert("User already exists. Please login.");
          setLoading(false);
          return;
      }
      const newUser: User = { id: `user-${Date.now()}`, email };
      const newRegistration = createInitialRegistration(newUser);
      setRegistrations(prev => [...prev, newRegistration]);
      setUser(newUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setLoading(false);
  }, [registrations]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(MOCK_USER_KEY);
  }, []);

  const getRegistrationForUser = useCallback((user: User) => {
    return registrations.find(r => r.id === user.id);
  }, [registrations]);
  
  const updateRegistrationDetails = useCallback((userId: string, details: Partial<Omit<HelmetRegistration, 'id' | 'documents' | 'verificationStatus'>>) => {
      setRegistrations(prev => prev.map(reg => reg.id === userId ? { ...reg, ...details } : reg));
  }, []);

  const updateDocument = useCallback((userId: string, docType: DocumentType, imageData: string) => {
      setRegistrations(prev => prev.map(reg => {
          if (reg.id === userId) {
              return {
                  ...reg,
                  documents: reg.documents.map(doc => 
                      doc.type === docType ? { ...doc, imageData, uploaded: true } : doc
                  )
              };
          }
          return reg;
      }));
  }, []);
  
  const findRegistrationByHelmetId = useCallback((helmetId: string) => {
      return registrations.find(r => r.helmetId.toLowerCase() === helmetId.toLowerCase());
  }, [registrations]);

  const updateVerificationStatus = useCallback((helmetId: string, status: VerificationStatus) => {
      setRegistrations(prev => prev.map(reg => reg.helmetId.toLowerCase() === helmetId.toLowerCase() ? { ...reg, verificationStatus: status } : reg));
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, registrations, login, logout, register, getRegistrationForUser, updateRegistrationDetails, updateDocument, findRegistrationByHelmetId, updateVerificationStatus }}>
      {children}
    </AppContext.Provider>
  );
};
