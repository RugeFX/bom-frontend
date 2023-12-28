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
import useGetPlans from "@/hooks/query/plan/useGetPlans";
import type { Plan } from "@/types/plan";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import DataTable from "@/components/data-table/DataTable";

interface LookupProps {
  value?: string;
  onSelect: (code: string) => void;
}
export default function PlanLookup({ value, onSelect }: LookupProps) {
  const { data: plans } = useGetPlans();

  const columns: ColumnDef<Plan>[] = [
    {
      accessorKey: "plan_code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("plan_code")}</div>;
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
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("address")}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const selected = value === row.getValue("plan_code");
        return selected ? (
          <Button disabled size="sm" variant="outline" className="flex items-center gap-2 w-full">
            <CheckCheckIcon className="w-4 h-4" /> <span className="hidden sm:block">Selected</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelect(row.getValue("plan_code"))}
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
        <DialogTitle>Lookup Plans</DialogTitle>
        <DialogDescription>Search for Plans to select.</DialogDescription>
      </DialogHeader>
      <div className="overflow-x-auto p-2">
        <DataTable data={plans} columns={columns} />
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
