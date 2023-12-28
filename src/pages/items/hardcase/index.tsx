import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useQuery, type QueryClient, FetchQueryOptions } from "@tanstack/react-query";
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
import ItemDataTable from "./components/data-table/ItemDataTable";
import { columns } from "./data/columns";
import type { TableMeta } from "@tanstack/react-table";
import type { BaseItem } from "@/types/items";
import type { GetResponse } from "@/types/response";
import ItemForm from "./components/ItemForm";
import apiClient from "@/api/apiClient";
import loaderRequireAuth from "@/auth/loaderRequireAuth";

export const itemsQuery: FetchQueryOptions<BaseItem[]> = {
  queryKey: ["items", "hardcase"],
  async queryFn() {
    const res = await apiClient.get<GetResponse<BaseItem[]>>("hardcaseItems");
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  await loaderRequireAuth();
  return (
    queryClient.getQueryData<BaseItem[]>(itemsQuery.queryKey) ??
    (await queryClient.fetchQuery(itemsQuery))
  );
};

export default function HardcaseItemPage() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  const initialData = (useLoaderData() ?? []) as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data } = useQuery({ ...itemsQuery, initialData });

  const meta: TableMeta<BaseItem> = {
    item: {
      onUpdateClick(id) {
        setEditModalOpen(true);
        setEditId(id);
      },
    },
  };

  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hardcase Items</h1>
        <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
          <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Add item</SheetTitle>
              <SheetDescription>Create a new item.</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <ItemForm
                mode="add"
                onSuccess={() => {
                  setAddModalOpen(false);
                }}
              />
            </div>
          </SheetContent>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add new item
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <div className="w-full">
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
          <EditSheet id={editId} open={editModalOpen} onSuccess={() => setEditModalOpen(false)} />
        </Sheet>
        <ItemDataTable data={data} columns={columns} meta={meta} />
      </div>
    </main>
  );
}
