import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableRowActions } from "../components/data-table/DataTableRowActions";
import type { ColumnDef } from "@tanstack/react-table";
import type { BaseItem } from "@/types/items";

export const columns: ColumnDef<BaseItem>[] = [
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
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions table={table} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
