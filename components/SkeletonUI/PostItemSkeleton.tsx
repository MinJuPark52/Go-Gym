export default function PostItemSkeleton() {
  return (
    <div className="h-80 min-w-80 cursor-pointer rounded-lg">
      <div>
        <div className="m-2 flex justify-between">
          <div className="skeleton h-4 w-16 rounded-md"></div>
          <div className="skeleton h-4 w-8 rounded-md"></div>
        </div>

        <div className="h-56 flex-col justify-between border-b border-[#ccc] pb-1">
          <div className="skeleton h-36 rounded-lg"></div>
          <div className="skeleton mt-4 h-8 w-48 rounded-lg"></div>
          <div className="mr-2 flex flex-col items-end">
            <div className="skeleton h-4 w-16 rounded-md"></div>
          </div>
        </div>
      </div>
      <div className="ml-2 mr-2 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="skeleton h-8 w-28 rounded-lg"></div>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
          <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
          <div className="skeleton h-4 w-20 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
