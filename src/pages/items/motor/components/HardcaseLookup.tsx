import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AnyItem } from "@/types/items";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import DataTable from "@/components/data-table/DataTable";
import useGetItems from "@/hooks/query/items/useGetItems";

interface LookupProps {
  value?: string;
  onSelect: (code: string) => void;
  onUnselect: () => void;
}
export default function HardcaseLookup({ value, onSelect, onUnselect }: LookupProps) {
  const { data } = useGetItems("hardcase");

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
        const selected = value === row.getValue("code");
        return selected ? (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 w-full"
            onClick={onUnselect}
          >
            <CheckCheckIcon className="w-4 h-4" /> <span className="hidden sm:block">Unselect</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelect(row.getValue("code"))}
            className="flex items-center gap-2 w-full"
          >
            <CheckIcon className="w-4 h-4" /> <span className="hidden sm:block">Select</span>
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
        <DialogTitle>Lookup Hardcases</DialogTitle>
        <DialogDescription>Search for Hardcases to select.</DialogDescription>
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
