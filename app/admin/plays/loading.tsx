export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card p-4">
          <div className="h-8 w-32 animate-pulse rounded bg-muted mb-4"></div>
          <div className="h-[300px] animate-pulse rounded bg-muted"></div>
        </div>
        <div className="col-span-3 rounded-lg border bg-card p-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 