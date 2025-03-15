import { api } from "./api"

export interface Showtime {
  id: number
  startTime: string
  priceVip: number
  priceNormal: number
  priceEconomy: number
  eventId: number
  roomId: number
  // Add other showtime properties if available from API
  event?: { id: number; name: string; startTime: string; duration: number; category: string; thumbnail: string }
  room?: { id: number; name: string; capacity: number }
}

export interface GetShowtimesParams {
  search?: string
  eventId?: number
  roomId?: number
  date?: string
  pageIndex: number
  pageSize: number
}

export interface GetShowtimesResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Showtime[]
}

export interface CreateShowtimeParams {
  startTime: string
  priceVip: number
  priceNormal: number
  priceEconomy: number
  eventId: number
  roomId: number
}

export interface UpdateShowtimeParams {
  startTime?: string
  priceVip?: number
  priceNormal?: number
  priceEconomy?: number
  eventId?: number
  roomId?: number
}

export const showtimesApi = {
  getShowtimes: async (params: GetShowtimesParams): Promise<GetShowtimesResponse> => {
    const response = await api.get("/Schedules", { params })
    return response.data
  },

  getShowtime: async (id: number): Promise<Showtime> => {
    const response = await api.get(`/Schedules/${id}`)
    return response.data
  },

  createShowtime: async (params: CreateShowtimeParams): Promise<Showtime> => {
    const response = await api.post("/Schedules", params)
    return response.data
  },

  updateShowtime: async (id: number, params: UpdateShowtimeParams): Promise<Showtime> => {
    const response = await api.put(`/Schedules/${id}`, params)
    return response.data
  },

  deleteShowtime: async (id: number): Promise<void> => {
    await api.delete(`/Schedules/${id}`)
  },

  // Add other showtime API functions (get, update, delete) here if needed later
} 