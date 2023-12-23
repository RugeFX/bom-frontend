import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../components/data-table/DataTableRowActions";
import { Size } from "@/types/size";

export const columns: ColumnDef<Size>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "master_code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Master code" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("master_code")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions table={table} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
