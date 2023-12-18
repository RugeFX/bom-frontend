import { FetchQueryOptions, QueryClient, useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import UpdateSheet from "./components/UpdateSheet";
import apiClient from "@/api/apiClient";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./components/DataTableRowActions";
import DataTable from "@/components/data-table/DataTable";
import { General } from "@/types/general";
import { GetResponse } from "@/types/response";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddSheet from "./components/AddSheet";
import { PlusIcon } from "lucide-react";

export const generalsQuery: FetchQueryOptions<General[]> = {
  queryKey: ["generals"],
  queryFn: async () => {
    const res = await apiClient.get<GetResponse<General[]>>("generals", {
      params: { relations: "color" },
    });
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData<General[]>(generalsQuery.queryKey) ??
    (await queryClient.fetchQuery(generalsQuery))
  );
};

const columnHelper = createColumnHelper<General>();

export default function GeneralPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);

  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: generals } = useQuery({ ...generalsQuery, initialData });

  const columns: ColumnDef<General, string>[] = useMemo(
    () => [
      columnHelper.display({
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
      columnHelper.accessor("item_code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => <div className="max-w-[80px] truncate">{row.getValue("item_code")}</div>,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="truncate font-medium">{row.getValue("name")}</span>,
      }),
      columnHelper.accessor(({ color }) => color?.name, {
        id: "color.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Color" />,
        cell: ({ row }) => (
          <span className="truncate font-medium">{row.getValue("color.name")}</span>
        ),
      }),
      columnHelper.accessor(({ quantity }) => `${quantity}`, {
        id: "quantity",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
        cell: ({ row }) => <span className="truncate font-medium">{row.getValue("quantity")}</span>,
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onEditClick={(id: number) => {
              setEditId(id);
              setEditModalOpen(true);
            }}
          />
        ),
      }),
    ],
    []
  );

  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex w-full justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Generals</h1>
        <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
          <AddSheet onSuccess={() => setAddModalOpen(false)} />
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add new item
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <div className="w-full">
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
          <UpdateSheet id={editId} open={editModalOpen} onSuccess={() => setEditModalOpen(false)} />
        </Sheet>
        <DataTable data={generals} columns={columns} />
      </div>
    </main>
  );
}
