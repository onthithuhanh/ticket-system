import { api } from "./api"

export enum RoomStatus {
  Active = "active",
  Inactive = "inactive",
  Maintenance = "maintenance",
  Closed = "closed",
}

export enum RoomCategory {
  Stage = "stage",
  Studio = "studio",
  Outdoor = "outdoor",
  Hall = "hall",
  Vip = "vip",
}

export enum SeatCategory {
  Economy = "Economy",
  Vip = "Vip",
  Normal = "Normal"
}

export interface RoomAmenity {
  amenityId: number
}

export interface RoomImage {
  imageUrl: string
}

export interface RoomSeat {
  status: "Available" | "Unavailable" | "Reserved";
  category: SeatCategory;
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
  status: RoomStatus
  category: RoomCategory
  roomImages: RoomImage[]
  roomAmenities: RoomAmenity[]
  seats: Seat[]
}

export interface Seat {
  id: number
  category: SeatCategory
  status: "Available" | "Unavailable" | "Reserved"
}

export interface GetRoomsParams {
  search?: string
  status?: RoomStatus
  category?: RoomCategory
  pageIndex: number
  pageSize: number
}

export interface GetRoomsResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Room[]
}

export interface CreateRoomParams {
  name: string
  category: RoomCategory
  status: RoomStatus
  location: string
  capacity: number
  description: string
  roomAmenities: { amenityId: number }[]
  length: number
  width: number
  height: number
  seats: Seat[]
}

export const roomsApi = {
  getRooms: async (params: GetRoomsParams): Promise<GetRoomsResponse> => {
    const response = await api.get("/rooms", { params })
    return response.data
  },

  getRoom: async (id: number): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  createRoom: async (params: CreateRoomParams): Promise<Room> => {
    const response = await api.post("/rooms", params)
    return response.data
  },

  updateRoom: async (id: number, params: Partial<CreateRoomParams>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, params)
    return response.data
  },

  deleteRoom: async (id: number): Promise<void> => {
    await api.delete(`/rooms/${id}`)
  },

  getAmenities: async () => {
    const response = await api.get('/amenities');
    return response.data;
  },
}; 