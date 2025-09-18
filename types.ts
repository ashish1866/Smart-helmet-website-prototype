
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DocumentType {
  AADHAR = 'Aadhar Card',
  LICENSE = "Driver's License",
  VEHICLE_REG = 'Vehicle Registration',
  RC = 'RC',
  INSURANCE = 'Insurance',
}

export interface Document {
  id: string;
  type: DocumentType;
  imageData: string | null; // base64 string
  uploaded: boolean;
}

export interface HelmetRegistration {
  id: string; // Corresponds to user ID
  helmetId: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  bikeRegistration: string;
  documents: Document[];
  verificationStatus: VerificationStatus;
}

export interface User {
  id: string;
  email: string;
  // In a real app, this would contain more user details
}
