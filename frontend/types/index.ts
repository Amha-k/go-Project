export interface User {
  id: string;
  name: string;
  email: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  tickets?: Ticket[];
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  events?: Event[];
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  price: number;
  companyId: string;
  eventDate: string;
  ticketNumber: number;
  tickets?: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  price: number;
  eventId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentRef: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tempToken?: string;
  requiresMfa?: boolean;
  user: User | Company;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  price: number;
  eventDate: string;
  ticketNumber: number;
}

export interface BuyTicketRequest {
  eventId: string;
  quantity: number;
}

export interface MFAVerifyRequest {
  tempToken: string;
  otp: string;
}
