import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { FetchQueryOptions, useQuery, type QueryClient } from "@tanstack/react-query";
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
import { columns } from "./data/columns";
import type { TableMeta } from "@tanstack/react-table";
import type { Plan } from "@/types/plan";
import loaderRequireAuth from "@/auth/loaderRequireAuth";
import apiClient from "@/api/apiClient";
import type { Reservation } from "@/types/reservation";
import { GetResponse } from "@/types/response";
import PickupForm from "./components/PickupForm";

export const reservationsQuery: FetchQueryOptions<Reservation[]> = {
  queryKey: ["reservations"],
  async queryFn() {
    const res = await apiClient.get<GetResponse<Reservation[]>>("reservations");

    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  await loaderRequireAuth();
  return (
    queryClient.getQueryData<Reservation[]>(reservationsQuery.queryKey) ??
    (await queryClient.fetchQuery(reservationsQuery))
  );
};

export default function ReservationPage() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  const initialData = (useLoaderData() ?? []) as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data } = useQuery({ ...reservationsQuery, initialData });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const meta: TableMeta<Plan> = {
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
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
          <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Add reservation</SheetTitle>
              <SheetDescription>Create a new reservation.</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <PickupForm
                onSuccess={() => {
                  setAddModalOpen(false);
                }}
              />
            </div>
          </SheetContent>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> New reservation
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <div className="w-full">
        <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
          <EditSheet id={editId} open={editModalOpen} onSuccess={() => setEditModalOpen(false)} />
        </Sheet>
        <DataTable data={data} columns={columns} meta={meta} />
      </div>
    </main>
  );
}
