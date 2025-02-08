import { api } from "./api"

export interface Role {
  id: string
  name: string
}

export interface User {
  id: string
  userName: string
  avatarUrl: string | null
  email: string | null
  emailConfirmed: boolean
  phoneNumber: string | null
  phoneNumberConfirmed: boolean
  fullName: string | null
  isActive: boolean
  isDeleted: boolean
  roles: Role[]
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
  deletedBy: string | null
  deletedAt: string | null
}

export interface GetUsersParams {
  Search?: string
  Role?: string
  IsActive?: boolean
  pageIndex: number
  pageSize: number
}

export interface GetUsersResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: User[]
}

export interface CreateUserParams {
  userName: string
  email?: string
  phoneNumber?: string
  fullName?: string
  password: string
  roleIds: string[]
}

export interface UpdateUserParams {
  userName?: string
  email?: string
  phoneNumber?: string
  fullName?: string
  isActive?: boolean
  roleIds?: string[]
}

export const usersApi = {
  getUsers: async (params: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await api.get("/users", { params })
    return response.data
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (params: CreateUserParams): Promise<User> => {
    const response = await api.post("/users", params)
    return response.data
  },

  updateUser: async (id: string, params: UpdateUserParams): Promise<User> => {
    const response = await api.put(`/users/${id}`, params)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
} 