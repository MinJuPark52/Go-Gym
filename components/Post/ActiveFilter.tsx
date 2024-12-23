interface propsType {
  filterValue: string;
}

export default function ActiveFilter({ filterValue }: propsType) {
  return (
    <>
      {filterValue && (
        <div className="flex h-9 items-center justify-center rounded-3xl bg-white pl-4 pr-4 text-sm font-bold text-gray-500 shadow-lg">
          {filterValue}
        </div>
      )}
    </>
  );
}
