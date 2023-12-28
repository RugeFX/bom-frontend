import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import DataTable from "@/components/data-table/DataTable";
import type { AnyItem } from "@/types/items";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import useGetItems from "@/hooks/query/items/useGetItems";

interface LookupProps {
  values: { general_code: string }[];
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
}

export default function GeneralLookup({ values, onAdd, onRemove }: LookupProps) {
  const { data } = useGetItems("general");

  const columns: ColumnDef<AnyItem>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("code")}</div>;
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
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("status")}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const valueInList =
          values.find((v) => v.general_code === row.getValue("code")) !== undefined;
        return valueInList ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemove(row.getValue("code"))}
            className="flex items-center gap-2 w-full"
          >
            <MinusCircleIcon className="w-4 h-4" /> <span className="hidden sm:block">Remove</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAdd(row.getValue("code"))}
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
    <DialogContent className="w-full max-h-screen overflow-y-auto sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Lookup Generals</DialogTitle>
        <DialogDescription>Search for Generals to add.</DialogDescription>
      </DialogHeader>
      <div className="overflow-x-auto p-2">
        <DataTable data={data} columns={columns} />
      </div>
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
