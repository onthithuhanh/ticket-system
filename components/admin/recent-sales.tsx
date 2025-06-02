import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RecentTransaction } from "@/lib/api/Dashboard"
import { memo } from "react"

interface RecentSalesProps {
  transactions?: RecentTransaction[];
}

const RecentSales = memo(function RecentSales({ transactions }: RecentSalesProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Không có giao dịch gần đây
      </div>
    )
  }

  // Take only first 3 transactions
  const displayTransactions = transactions.slice(0, 5)
  // Calculate how many empty slots we need to fill
  const emptySlots = 3 - displayTransactions.length

  return (
    <div className="space-y-8">
      {displayTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>
              {transaction.user?.fullName?.charAt(0) || transaction.user?.userName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.user?.fullName || transaction.user?.userName || "Khách hàng"}
            </p>
            <p className="text-sm text-muted-foreground">{transaction.user?.email || "Không có email"}</p>
          </div>
          <div className="ml-auto font-medium">+{transaction.totalPrice.toLocaleString()}đ</div>
        </div>
      ))}
      {/* Add empty slots to maintain consistent spacing */}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <div key={`empty-${index}`} className="flex items-center opacity-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Placeholder</p>
            <p className="text-sm text-muted-foreground">placeholder@email.com</p>
          </div>
          <div className="ml-auto font-medium">+0đ</div>
        </div>
      ))}
    </div>
  )
})

export { RecentSales }
