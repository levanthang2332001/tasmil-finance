import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/Navbar"
import BackButton from "@/components/BackButton"

const loading = () => {
  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton className="" />
        </Navbar>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[360px] h-full border-l bg-background">
        <div className="flex flex-col h-full p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </>
  )
}

export default loading