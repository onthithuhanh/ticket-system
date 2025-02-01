import api from './config';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Show {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  duration: number; // Duration in minutes
  director: string;
  cast: string[];
  mainImage: string;
  images: string[];
  ticketTypes: TicketType[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShowData {
  title: string;
  description: string;
  duration: number;
  category: string;
  price: {
    regular: number;
    vip: number;
  };
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
    description?: string;
  }[];
  showTimes: {
    date: Date;
    startTime: string;
    endTime: string;
  }[];
  images: string[];
  createdBy: string;
  status?: 'draft' | 'pending' | 'approved' | 'cancelled';
}

export const showApi = {
  getAllShows: async () => {
    const response = await api.get('/shows');
    return response.data;
  },

  getShowById: async (id: string) => {
    const response = await api.get(`/shows/${id}`);
    return response.data;
  },

  createShow: async (data: CreateShowData) => {
    const response = await api.post('/shows', data);
    return response.data;
  },

  updateShow: async (id: string, data: Partial<Show>) => {
    const response = await api.put(`/shows/${id}`, data);
    return response.data;
  },

  deleteShow: async (id: string) => {
    const response = await api.delete(`/shows/${id}`);
    return response.data;
  },

  searchShows: async (query: string) => {
    const response = await api.get(`/shows/search?q=${query}`);
    return response.data;
  },
}; 