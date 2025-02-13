import { api } from "./api"

export interface EventImage {
  id: number
  imageUrl: string
}

export interface RoomAmenity {
  amenityId: number
  amenity: {
    id: number
    name: string
  }
}

export interface Event {
  id: number
  name: string
  duration: number
  isCancelled: boolean
  shortDescription: string
  detailedDescription: string
  director: string
  actors: string
  thumbnail: string
  category: string
  eventImages: EventImage[]
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
  deletedBy: string | null
  deletedAt: string | null
}

export interface Room {
  id: number
  name: string
  description: string
  location: string
  capacity: number
  length: number
  width: number
  height: number
  status: string
  category: string
  numberSeatsOfRow: number
  roomImages: any[]
  roomAmenities: RoomAmenity[]
}

export interface Showtime {
  id: number
  startTime: string
  priceVip: number
  priceNormal: number
  priceEconomy: number
  eventId: number
  roomId: number
  event?: Event
  room?: Room
}

export interface GetShowtimesParams {
  search?: string
  eventId?: number
  roomId?: number
  date?: string
  StartTimeFrom?: string
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
    const response = await api.get("/Schedules", { 
      params: {
        ...params,
        StartTimeFrom: params.StartTimeFrom || new Date().toISOString().split('T')[0] // Default to today if not provided
      }
    })
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