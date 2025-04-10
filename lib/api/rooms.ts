import { api } from "./api"

export enum RoomStatus {
  Active = "Active",
  Inactive = "Inactive",
  Maintenance = "Maintenance",
  Closed = "Closed",
}

export enum RoomCategory {
  Stage = "Stage",
  Studio = "Studio",
  Outdoor = "Outdoor",
  Hall = "Hall",
  Vip = "Vip",
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
  status: "Available" | "Blocked" | "Reserved";
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
  numberSeatsOfRow: number
  status: RoomStatus
  category: RoomCategory
  roomImages: RoomImage[]
  roomAmenities: RoomAmenity[]
  seats: Seat[]
}

export interface Seat {
  id: number
  category: SeatCategory
  status: "Available" | "Blocked" | "Reserved"
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
  name: string;
  description: string;
  location: string;
  capacity: number;
  length: number;
  width: number;
  height: number;
  numberSeatsOfRow: number;
  status: RoomStatus;
  category: RoomCategory;
  roomAmenities: Array<{ amenityId: number }>;
  roomImages: any[];
  seats: Seat[];
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