import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { FetchQueryOptions, QueryClient, useQuery } from "@tanstack/react-query";
import type { TableMeta } from "@tanstack/react-table";
import apiClient from "@/api/apiClient";
import DataTable from "./components/data-table/DataTable";
import { GetResponse } from "@/types/response";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddSheet from "./components/AddSheet";
import { MaterialItem } from "@/types/material";
import { columns } from "./data/columns";
import EditSheet from "./components/EditSheet";

export const materialsQuery: FetchQueryOptions<MaterialItem[]> = {
  queryKey: ["materials"],
  queryFn: async () => {
    const res = await apiClient.get<GetResponse<MaterialItem[]>>("materials");
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData<MaterialItem[]>(materialsQuery.queryKey) ??
    (await queryClient.fetchQuery(materialsQuery))
  );
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    material: {
      onUpdateClick: (item_code: string) => void;
    };
  }
}

export default function MaterialPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");

  const initialData = (useLoaderData() ?? []) as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: materials } = useQuery({ ...materialsQuery, initialData });

  const meta: TableMeta<MaterialItem> = {
    material: {
      onUpdateClick(item_code) {
        setEditId(item_code);
        setEditModalOpen(true);
      },
    },
  };

  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
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
          <EditSheet
            itemCode={editId}
            open={editModalOpen}
            onSuccess={() => setEditModalOpen(false)}
          />
        </Sheet>
        <DataTable data={materials} columns={columns} meta={meta} />
      </div>
    </main>
  );
}
