import api from "./config";

interface EventImage {
  id?: number;
  imageUrl: string;
}

interface Event {
  id: number;
  name: string;
  duration: number;
  isCancelled: boolean;
  shortDescription: string;
  detailedDescription: string;
  director: string;
  actors: string;
  thumbnail: string;
  category: string;
  eventImages: EventImage[];
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
}

interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  contends: T[];
}

interface GetEventsParams {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  category?: string;
  isCancelled?: boolean;
}

export const eventsApi = {
  createEvent: async (
    data: Omit<
      Event,
      | "id"
      | "createdBy"
      | "createdAt"
      | "modifiedBy"
      | "modifiedAt"
      | "deletedBy"
      | "deletedAt"
    >
  ) => {
    const response = await api.post(`/Events`, data);
    return response.data;
  },
  getEvents: async ({
    search,
    pageIndex = 1,
    pageSize = 8,
    category,
    isCancelled = undefined,
  }: GetEventsParams = {}) => {
    const response = await api.get<PaginatedResponse<Event>>(`/Events`, {
      params: {
        Search: search,
        PageIndex: pageIndex,
        PageSize: pageSize,
        Category: category !== "all" ? category : undefined,
        isCancelled: isCancelled,
      },
    });
    return response.data;
  },
  getEvent: async (id: number) => {
    const response = await api.get<Event>(`/Events/${id}`);
    return response.data;
  },
  updateEvent: async (
    id: number,
    data: Omit<
      Event,
      | "id"
      | "createdBy"
      | "createdAt"
      | "modifiedBy"
      | "modifiedAt"
      | "deletedBy"
      | "deletedAt"
    >
  ) => {
    const response = await api.put(`/Events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id: number) => {
    const response = await api.delete(`/Events/${id}`);
    return response.data;
  },
};
