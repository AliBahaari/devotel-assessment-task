import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { useDarkModeStore } from "../stores/useDarkModeStore";
import { translations } from "../configs/translations";
import { useLocalizationStore } from "../stores/useLocalizationStore";

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
  const language = useLocalizationStore((state) => state.language);
  const darkMode = useDarkModeStore((state) => state.darkMode);

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
          className={`${i === currentPage ? (darkMode ? "bg-slate-500" : "bg-slate-300") : ""} rounded-full cursor-pointer w-10 h-10 flex justify-center items-center`}
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
                    className={`text-center text-[14px] ${darkMode ? "text-white" : "text-[#707070]"}`}
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
                          : translations[language].sort}
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
                {translations[language].loading}...
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
                  <td key={cell.id} className={`${cellClassName}`}>
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
                {translations[language].nothing}!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalRows > pageSize && (
        <div
          className={`${darkMode ? "bg-slate-400" : "bg-slate-100"} grid grid-cols-3 space-x-2 px-[20px] py-[16px]`}
        >
          <div className="flex flex-row items-center gap-2 text-[14px]">
            <span>{translations[language].page}</span>
            <div
              className={`${darkMode ? "border-slate-500" : "border-slate-300"} bg-white text-black flex h-[38px] w-[46px] items-center justify-center rounded-[8px] border`}
            >
              <span className="text-[16px] font-bold">{currentPage}</span>
            </div>
            <span>{translations[language].from}</span>
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
              {translations[language].back}
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
              {translations[language].next}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
