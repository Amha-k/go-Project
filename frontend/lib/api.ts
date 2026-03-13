import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach token
    this.api.interceptors.request.use((config) => {
      const token = Cookies.get('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          Cookies.remove('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async userRegister(data: { name: string; email: string; password: string }) {
    return this.api.post('/users/register', data);
  }

  async userLogin(data: { email: string; password: string }) {
    return this.api.post('/users/login', data);
  }

  async companyRegister(data: { name: string; email: string; password: string }) {
    return this.api.post('/company/register', data);
  }

  async companyLogin(data: { email: string; password: string }) {
    return this.api.post('/company/login', data);
  }

  async verifyMFA(data: { tempToken: string; otp: string }) {
    return this.api.post('/verify-mfa', data);
  }

  // User endpoints
  async getEvents() {
    return this.api.get('/users/events');
  }

  async getEventById(id: string) {
    return this.api.get(`/users/events/${id}`);
  }

  async searchEvents(query: string) {
    return this.api.get('/users/search', { params: { q: query } });
  }

  async buyTicket(eventId: string) {
    return this.api.post(`/users/events/${eventId}/buy`);
  }

  async buyTicketStripe(eventId: string) {
    return this.api.post(`/users/events1/${eventId}/buy`);
  }

  async getUserTickets() {
    return this.api.get('/users/tickets');
  }

  async enableMFA() {
    return this.api.get('/users/MFAoption');
  }

  async verifyPayment(txref: string) {
    return this.api.get(`/users/payment/verify/${txref}`);
  }

  async verifyStripePayment() {
    return this.api.get('/users/payment/stripe/success');
  }

  async userLogout() {
    return this.api.post('/users/logout');
  }

  // Company endpoints
  async getCompanyEvents() {
    return this.api.get('/company/event');
  }

  async createEvent(data: {
    name: string;
    description: string;
    price: number;
    eventDate: string;
    ticketNumber: number;
  }) {
    return this.api.post('/company/event', data);
  }

  async updateEvent(id: string, data: any) {
    return this.api.patch(`/company/event/${id}`, data);
  }

  async deleteEvent(id: string) {
    return this.api.delete(`/company/event/${id}`);
  }

  async companyLogout() {
    return this.api.post('/company/logout');
  }
}

export const apiClient = new ApiClient();
