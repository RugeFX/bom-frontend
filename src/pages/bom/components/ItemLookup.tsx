import apiClient from "@/api/apiClient";
import DataTable from "./data-table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { models } from "../data/data";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import type { MaterialItem } from "@/types/material";

interface ItemLookupProps {
  values: string[];
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
}

export default function ItemLookup({ values, onAdd, onRemove }: ItemLookupProps) {
  const { data: items } = useQuery<MaterialItem[]>({
    queryKey: ["materials"],
    async queryFn() {
      const res = await apiClient.get<GetResponse<MaterialItem[]>>("materials");
      return res.data.data;
    },
    initialData: [],
  });

  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "item_code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Item code" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("item_code")}</div>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorFn: (item) => item.model.split("_")[0],
      accessorKey: "model",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      cell: ({ row }) => {
        const model = models.find((model) => model.value === row.getValue("model"));

        if (!model) {
          return null;
        }

        return <div className="font-medium">{model.label}</div>;
      },
      filterFn: (row, id, value) => (value as string).includes(row.getValue(id)),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const valueInList = values.find((v) => v === row.getValue("item_code")) !== undefined;
        return valueInList ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemove(row.getValue("item_code"))}
            className="flex items-center gap-2 w-full"
          >
            <MinusCircleIcon className="w-4 h-4" /> <span className="hidden sm:block">Remove</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAdd(row.getValue("item_code"))}
            className="flex items-center gap-2 w-full"
          >
            <PlusCircleIcon className="w-4 h-4" /> <span className="hidden sm:block">Add</span>
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <DialogContent className="w-full max-h-screen overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Lookup items</DialogTitle>
        <DialogDescription>Search for items to add.</DialogDescription>
      </DialogHeader>
      <DataTable data={items} columns={columns} />
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
