import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>NT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nguyễn Thị Hương</p>
          <p className="text-sm text-muted-foreground">huong.nguyen@example.com</p>
        </div>
        <div className="ml-auto font-medium">+500.000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>TL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Trần Văn Lâm</p>
          <p className="text-sm text-muted-foreground">lam.tran@example.com</p>
        </div>
        <div className="ml-auto font-medium">+300.000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>PH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Phạm Minh Hiếu</p>
          <p className="text-sm text-muted-foreground">hieu.pham@example.com</p>
        </div>
        <div className="ml-auto font-medium">+1.200.000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Lê Thị Mai</p>
          <p className="text-sm text-muted-foreground">mai.le@example.com</p>
        </div>
        <div className="ml-auto font-medium">+800.000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>VD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Vũ Đức Anh</p>
          <p className="text-sm text-muted-foreground">anh.vu@example.com</p>
        </div>
        <div className="ml-auto font-medium">+2.000.000đ</div>
      </div>
    </div>
  )
}
