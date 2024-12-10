interface propsType {
  filterValue: string;
}

export default function ActiveFilter({ filterValue }: propsType) {
  return (
    <>
      {filterValue && (
        <div className="flex justify-center items-center h-9 pl-4 pr-4 rounded-3xl bg-white shadow-lg text-gray-500 text-sm font-bold">
          {filterValue}
        </div>
      )}
    </>
  );
}
