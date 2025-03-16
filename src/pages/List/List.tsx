import { ColumnDef } from "@tanstack/react-table";
import { useGetFormsSubmissions } from "../../apis/GetFormsSubmissions";
import { DataTable } from "../../components/DataTable";
import { useEffect, useMemo, useState } from "react";
import { useLocalizationStore } from "../../stores/useLocalizationStore";
import { translations } from "../../configs/translations";

type TableType = {
  "Full Name": string;
  Age: number;
  Gender: "Male" | "Female";
  "Insurance Type": "Health" | "Home" | "Car";
  City: string;
};
type SelectedColumns = {
  checked: boolean;
  value: string;
};

const PAGE_SIZE = 2;

function List() {
  const language = useLocalizationStore((state) => state.language);

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: getFormsSubmissionsData,
    isFetching: getFormsSubmissionsIsFetching,
  } = useGetFormsSubmissions();

  const columns: ColumnDef<TableType>[] = useMemo(() => {
    const clonedSelectedColumns = [...selectedColumns].map((i) => i.value);
    return (
      getFormsSubmissionsData?.columns
        .filter((i) => clonedSelectedColumns.includes(i))
        .map((i) => {
          return {
            accessorKey: i,
            header: i,
          };
        }) || []
    );
  }, [getFormsSubmissionsData, selectedColumns]);

  const data = useMemo(() => {
    return getFormsSubmissionsData?.data
      ?.map((i) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...restProperties } = i;
        return restProperties;
      })
      .filter((i) =>
        i["Full Name"].toLowerCase().includes(search.toLowerCase()),
      )
      .slice(
        search.length > 0 ? 0 : (pageNumber - 1) * PAGE_SIZE,
        search.length > 0
          ? getFormsSubmissionsData?.data.length
          : pageNumber * PAGE_SIZE,
      );
  }, [getFormsSubmissionsData?.data, search, pageNumber]);

  const handleSelectedColumns = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      setSelectedColumns((previousState) => {
        return [
          ...previousState,
          {
            checked: event.target.checked,
            value: event.target.value,
          },
        ];
      });
    } else if (!event.target.checked) {
      const clonedSelectedColumns = [...selectedColumns].filter(
        (i) => i.value !== event.target.value,
      );
      setSelectedColumns(clonedSelectedColumns);
    }
  };

  useEffect(() => {
    const allColumns =
      getFormsSubmissionsData?.columns.map((i) => ({
        checked: true,
        value: i,
      })) || [];
    setSelectedColumns(allColumns);
  }, [getFormsSubmissionsData?.columns]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-10 items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium">
            {translations[language].which_columns_to_display}?
          </span>
          <div>
            {getFormsSubmissionsData?.columns.map((i, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between gap-2"
              >
                <label className="text-sm">{i}</label>
                <input
                  type="checkbox"
                  value={i}
                  onChange={(event) => handleSelectedColumns(event)}
                  checked={selectedColumns.some(
                    (j) => i === j.value && j.checked === true,
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <input
          type="text"
          className="border w-xs px-1 py-1"
          placeholder={`${translations[language].search}...`}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="mt-10">
        <DataTable
          cellClassName="min-w-[150px]"
          columns={columns || []}
          data={data || []}
          isLoading={getFormsSubmissionsIsFetching}
          totalRows={
            search.length > 0
              ? data?.length
              : getFormsSubmissionsData?.data.length
          }
          currentPage={pageNumber}
          pageSize={
            search.length > 0 ? getFormsSubmissionsData?.data.length : PAGE_SIZE
          }
          onPageChange={(pageNumber) => setPageNumber(pageNumber)}
        />
      </div>
    </>
  );
}

export default List;
