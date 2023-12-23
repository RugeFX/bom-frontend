import apiClient from "@/api/apiClient";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Master } from "@/types/master";
import { GetResponse } from "@/types/response";
import { FetchQueryOptions, QueryClient, useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MouseEventHandler, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { DataTableRowActions } from "./components/DataTableRowActions";
import { Sheet } from "@/components/ui/sheet";
import MasterDetailSheet from "./components/MasterDetailSheet";
import DataTable from "@/components/data-table/DataTable";

export const mastersQuery: FetchQueryOptions<Master[]> = {
  queryKey: ["masters"],
  queryFn: async () => {
    const res = await apiClient.get<GetResponse<Master[]>>("masters");
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData<Master[]>(mastersQuery.queryKey) ??
    (await queryClient.fetchQuery(mastersQuery))
  );
};

const masterHelper = createColumnHelper<Master>();

export default function MasterPage() {
  const [shownId, setShownId] = useState<string>("");

  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: masters } = useQuery({ ...mastersQuery, initialData });

  const onPreviewClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.value;
    setShownId(id);
  };

  const columns: ColumnDef<Master, string>[] = useMemo(
    () => [
      masterHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      masterHelper.accessor("master_code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => (
          <div className="max-w-[80px] truncate">{row.getValue("master_code")}</div>
        ),
      }),
      masterHelper.accessor(({ category_id }) => `${category_id}`, {
        id: "category_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category ID" />,
        cell: ({ row }) => (
          <span className="max-w-[500px] truncate font-medium">{row.getValue("category_id")}</span>
        ),
      }),
      masterHelper.display({
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} onPreviewClick={onPreviewClick} />,
      }),
    ],
    []
  );

  return (
    <Sheet>
      <main className="space-y-4 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Masters</h1>
        <MasterDetailSheet id={+shownId} />
        <div className="w-full">
          <DataTable data={masters} columns={columns} />
        </div>
      </main>
    </Sheet>
  );
}
