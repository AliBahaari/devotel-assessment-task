import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRows?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  rowClassName?: string;
  cellClassName?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalRows = 0,
  currentPage = 0,
  pageSize = 0,
  onPageChange = () => {},
  rowClassName = "",
  cellClassName = "",
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <div
          onClick={() => onPageChange(i)}
          className={`${i === currentPage ? "bg-slate-400 text-white" : "bg-slate-200"} cursor-pointer w-10 h-10 flex justify-center items-center`}
          key={i}
        >
          <span>{i}</span>
        </div>,
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="text-center text-[14px] text-[#707070]"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
                  >
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </span>
                    <span> / </span>
                    <span>
                      {header.column.getIsSorted() === "desc"
                        ? " 🔼"
                        : header.column.getIsSorted() === "asc"
                          ? " 🔽"
                          : "Sort"}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${rowClassName} border-b-[1px] border-solid border-gray-400`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={`border ${cellClassName}`}>
                    <div className="my-3 line-clamp-2 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center">
                Nothing!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalRows > pageSize && (
        <div className="grid grid-cols-3 space-x-2 bg-slate-100 px-[20px] py-[16px]">
          <div className="flex flex-row items-center gap-2 text-[14px]">
            <span>Page</span>
            <div className="flex h-[38px] w-[46px] items-center justify-center rounded-[8px] border border-slate-300 bg-white">
              <span className="text-[16px] font-bold">{currentPage}</span>
            </div>
            <span>from</span>
            <span>{totalPages}</span>
          </div>

          <div className="flex flex-row items-center gap-2">
            <div
              onClick={
                currentPage > 1
                  ? () => onPageChange(currentPage - 1)
                  : undefined
              }
              className={`
                cursor-pointer
                ${currentPage <= 1 && "!cursor-not-allowed opacity-20"}
              `}
            >
              Back
            </div>
            {renderPageNumbers()}
            <div
              onClick={
                currentPage < totalPages
                  ? () => onPageChange(currentPage + 1)
                  : undefined
              }
              className={`
                cursor-pointer
                ${currentPage >= totalPages && "!cursor-not-allowed opacity-20"}
              `}
            >
              Next
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
