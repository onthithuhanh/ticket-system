import api from "./config"

interface Amenity {
  id: string
  name: string
  description?: string
  icon?: string
  status?: string
}

export const amenitiesApi = {
  createAmenity: async (data: { name: string; description?: string; icon?: string; status?: string }) => {
    const response = await api.post(`/Amenities`, data)
    return response.data
  },
  getAmenities: async () => {
    const response = await api.get(`/Amenities`)
    return response.data
  },
  getAmenity: async (id: string) => {
    const response = await api.get(`/Amenities/${id}`)
    return response.data
  },
  updateAmenity: async (id: string, data: { name: string; description?: string; icon?: string; status?: string }) => {
    const response = await api.put(`/Amenities/${id}`, data)
    return response.data
  },
  deleteAmenity: async (id: string) => {
    const response = await api.delete(`/Amenities/${id}`)
    return response.data
  },
} 