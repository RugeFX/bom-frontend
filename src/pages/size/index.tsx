import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useQuery, type FetchQueryOptions, type QueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type { GetResponse } from "@/types/response";
import type { Size } from "@/types/size";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import EditSheet from "./components/EditSheet";
import DataTable from "@/components/data-table/DataTable";
import SizeForm from "./components/SizeForm";
import { TableMeta } from "@tanstack/react-table";
import { columns } from "./data/columns";
import loaderRequireAuth from "@/auth/loaderRequireAuth";

export const sizesQuery: FetchQueryOptions<Size[]> = {
  queryKey: ["sizes"],
  queryFn: async () => {
    const res = await apiClient.get<GetResponse<Size[]>>("sizes");
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  await loaderRequireAuth();
  return (
    queryClient.getQueryData<Size[]>(sizesQuery.queryKey) ??
    (await queryClient.fetchQuery(sizesQuery))
  );
};

export default function SizePage() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  const initialData = (useLoaderData() ?? []) as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: sizes } = useQuery({ ...sizesQuery, initialData });

  const meta: TableMeta<Size> = {
    default: {
      onUpdateClick(id) {
        setEditModalOpen(true);
        setEditId(id);
      },
    },
  };

  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sizes</h1>
        <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
          <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Add size</SheetTitle>
              <SheetDescription>Create a new size.</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <SizeForm
                mode="add"
                onSuccess={() => {
                  setAddModalOpen(false);
                }}
              />
            </div>
          </SheetContent>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add new size
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <div className="w-full">
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
          <EditSheet id={editId} open={editModalOpen} onSuccess={() => setEditModalOpen(false)} />
        </Sheet>
        <DataTable data={sizes} columns={columns} meta={meta} />
      </div>
    </main>
  );
}
