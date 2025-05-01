import api from './config';

export interface RecentTransaction {
  id: string;
  totalPrice: number;
  status: "Success" | "Failed" | "Pending";
  method: "VnPay" | "Momo";
  createdAt: string;
  user: {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
  };
  schedule: {
    id: number;
    startTime: string;
    event: {
      id: number;
      name: string;
    };
  };
}

export interface DashboardData {
  revenue: {
    currentMonthRevenue: number;
    percentageChange: number;
  };
  ticketStatistic: {
    currentTicketCount: number;
    percentageChange: number;
  };
  userStatistic: {
    currentUserCount: number;
    lastMonthUserCount: number;
    difference: number;
  };
  eventStatistic: {
    currentEventCount: number;
    lastMonthEventCount: number;
    difference: number;
  };
  monthlyRevenues: {
    month: number;
    total: number;
  }[];
  recentTransactions: RecentTransaction[];
}

export const dashboardApi = {
  getDashboardData: async () => {
    const response = await api.get('/Dashboards');
    return response.data as DashboardData;
  },
}; 