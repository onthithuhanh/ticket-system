import api from './config';

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {
  eventId: string;
  quantity: number;
}

export const ticketApi = {
  getAllTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getTicketById: async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: CreateTicketData) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  updateTicket: async (id: string, data: Partial<Ticket>) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  deleteTicket: async (id: string) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  getUserTickets: async () => {
    const response = await api.get('/tickets/user');
    return response.data;
  },
}; 