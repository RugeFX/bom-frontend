import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableRowActions } from "../components/data-table/DataTableRowActions";
import type { ColumnDef } from "@tanstack/react-table";
import type { Plan } from "@/types/plan";

export const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: "plan_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Master code" />,
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
    cell: ({ row, table }) => <DataTableRowActions table={table} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
