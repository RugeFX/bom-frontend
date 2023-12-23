import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { MaterialItem } from "@/types/material";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "../components/data-table/DataTableRowActions";
import { models } from "./data";

export const columns: ColumnDef<MaterialItem>[] = [
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
    accessorFn: (row) => `${row.quantity}`,
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("quantity")}</div>;
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
    cell: ({ row }) => {
      const model = models.find(
        (model) => model.value === (row.getValue("model") as string).split("_")[0]
      );

      if (!model) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {model.icon && <model.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span className="font-medium">{model.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (value as string).includes((row.getValue(id) as string).split("_")[0]);
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions table={table} row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
