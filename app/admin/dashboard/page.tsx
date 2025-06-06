"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { CalendarDays, Users, Ticket, DollarSign } from "lucide-react"
import { dashboardApi } from "@/lib/api/Dashboard"
import { useEffect, useState } from "react"
import api from "@/lib/api/config"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardApi.getDashboardData()
        setDashboardData({
          ...data
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentTransactions = async () => {
      try {
        setIsTransactionsLoading(true)
        const response = await api.get('/Bookings?SortColumn=createdAt&SortDir=Desc&PageSize=5&PageIndex=1&Status=Completed')
        setRecentTransactions(response.data.contends)
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
      } finally {
        setIsTransactionsLoading(false)
      }
    }

    fetchDashboardData()
    fetchRecentTransactions()

  }, [])

  if (loading) {
    return null // Let the loading.tsx handle the loading state
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu tháng này</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.revenue.currentMonthRevenue.toLocaleString('vi-VN')}đ</div>
                <p className="text-xs text-muted-foreground">
                  <span className={dashboardData?.revenue.percentageChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {dashboardData?.revenue.percentageChange >= 0 ? "+" : ""}{dashboardData?.revenue.percentageChange.toFixed(1)}%
                  </span> so với tháng trước
                </p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sự kiện đang diễn ra</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.eventStatistic.currentEventCount}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={dashboardData?.eventStatistic.difference >= 0 ? "text-green-500" : "text-red-500"}>
                    {dashboardData?.eventStatistic.difference >= 0 ? "+" : ""}{dashboardData?.eventStatistic.difference}
                  </span> so với tháng trước
                </p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vé đã bán</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.ticketStatistic.currentTicketCount}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={dashboardData?.ticketStatistic.percentageChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {dashboardData?.ticketStatistic.percentageChange >= 0 ? "+" : ""}{dashboardData?.ticketStatistic.percentageChange.toFixed(1)}%
                  </span> so với tháng trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.userStatistic.currentUserCount}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={dashboardData?.userStatistic.difference >= 0 ? "text-green-500" : "text-red-500"}>
                    {dashboardData?.userStatistic.difference >= 0 ? "+" : ""}{dashboardData?.userStatistic.difference}
                  </span> so với tháng trước
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={dashboardData?.monthlyRevenues} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Giao dịch gần đây</CardTitle>
            
              </CardHeader>
              <CardContent>
                {isTransactionsLoading ? (
                   <div className="text-center text-muted-foreground">Đang tải giao dịch...</div>
                ) : recentTransactions.length === 0 ? (
                   <div className="text-center text-muted-foreground">Không có giao dịch gần đây</div>
                ) : (
                  <RecentSales transactions={recentTransactions} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
