import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/components/data-table/DataTableViewOptions";
import { statusOptions } from "../../data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function ItemDataTableToolbar<TData>({
  table,
  filter,
  setFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex sm:flex-1 items-center space-x-2">
        <Input
          placeholder="Filter records..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}