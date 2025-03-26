import { api } from "./api"

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
  eventImages: { id: number; imageUrl: string }[]
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
  deletedBy: string | null
  deletedAt: string | null
}

export interface GetEventsParams {
  search?: string
  isCancelled?: boolean
  category?: string
  sortColumn?: string
  sortDir?: string
  pageIndex: number
  pageSize: number
}

export interface GetEventsResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Event[]
}

export interface CreateEventParams {
  name: string
  duration: number
  isCancelled: boolean
  shortDescription: string
  detailedDescription: string
  director: string
  actors: string
  thumbnail: string
  category: string
  eventImages: {  imageUrl: string }[]
}

export const eventsApi = {
  getEvents: async (params: GetEventsParams): Promise<GetEventsResponse> => {
    const response = await api.get("/events", { params })
    return response.data
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  createEvent: async (params: CreateEventParams): Promise<Event> => {
    const response = await api.post("/events", params)
    return response.data
  },

  updateEvent: async (id: number, params: Partial<CreateEventParams>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, params)
    return response.data
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`)
  }
}
