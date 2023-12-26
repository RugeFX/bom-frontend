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
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { models } from "@/lib/models";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import useGetBoms from "@/hooks/query/bom/useGetBoms";
import type { BOM } from "@/types/bom";
import DataTableLookup from "./data-table/DataTableLookup";

interface LookupProps {
  value: string;
  onSelect: (code: string) => void;
}

export default function BOMLookup({ value, onSelect }: LookupProps) {
  const { data: boms } = useGetBoms();

  const columns: ColumnDef<BOM>[] = [
    {
      accessorKey: "bom_code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="BOM code" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("bom_code")}</div>;
      },
    },
    {
      accessorFn: (bom) =>
        Array.from(
          new Set(
            bom.material.map(
              (mat) =>
                (mat.general ?? mat.hardcase ?? mat.helmet ?? mat.medicine ?? mat.motor)
                  ?.master_code
            )
          )
        ).join(","),
      accessorKey: "models",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      cell: ({ row }) => {
        const rowModels = models.filter((model) =>
          (row.getValue("models") as string).includes(model.id)
        );

        if (!rowModels) {
          return null;
        }

        return <div className="font-medium">{rowModels.map((m) => m.label).join(", ")}</div>;
      },
      filterFn: (row, id, value) => {
        const filteredModelValues = models
          .filter((model) => (row.getValue(id) as string).includes(model.id))
          .map((m) => m.value)
          .filter((v) => (value as string[]).includes(v));

        return filteredModelValues.length > 0;
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const selected = value === row.getValue("bom_code");
        return selected ? (
          <Button disabled size="sm" variant="outline" className="flex items-center gap-2 w-full">
            <CheckCheckIcon className="w-4 h-4" /> <span className="hidden sm:block">Selected</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelect(row.getValue("bom_code"))}
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
        <DialogTitle>Lookup BOMs</DialogTitle>
        <DialogDescription>Search for BOMs to select.</DialogDescription>
      </DialogHeader>
      <DataTableLookup data={boms} columns={columns} />
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
