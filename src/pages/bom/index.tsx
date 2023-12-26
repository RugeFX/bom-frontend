import DataTable from "@/components/data-table/DataTable";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import type { BOM } from "@/types/bom";
import { useQuery, type QueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { DataTableRowActions } from "./components/DataTableRowActions";
import AddSheet from "./components/AddSheet";
import EditSheet from "./components/EditSheet";
import { bomsQuery } from "@/hooks/query/bom/useGetBoms";

export const loader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData<BOM[]>(bomsQuery.queryKey) ?? (await queryClient.fetchQuery(bomsQuery))
  );
};

const columnHelper = createColumnHelper<BOM>();

export default function BomPage() {
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: boms } = useQuery({ ...bomsQuery, initialData });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);

  const columns: ColumnDef<BOM, string>[] = useMemo(
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
      columnHelper.accessor("bom_code", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => <div className="max-w-[80px] truncate">{row.getValue("bom_code")}</div>,
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
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">BOMs</h1>
        <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
          <AddSheet onSuccess={() => setAddModalOpen(false)} />
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add new BOM
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <div className="w-full">
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
          <EditSheet id={editId} open={editModalOpen} onSuccess={() => setEditModalOpen(false)} />
        </Sheet>
        <DataTable data={boms ?? []} columns={columns} />
      </div>
    </main>
  );
}
