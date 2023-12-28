import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableRowActions } from "../components/data-table/DataTableRowActions";
import type { ColumnDef } from "@tanstack/react-table";
import type { Reservation } from "@/types/reservation";

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "reservation_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("reservation_code")}</div>;
    },
  },
  {
    accessorKey: "pickupPlan_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pickup Plan" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("pickupPlan_code")}</div>;
    },
  },
  {
    accessorKey: "returnPlan_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Return Plan" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("returnPlan_code") ?? "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("status") ?? "-"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions table={table} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
