import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { masterSchema } from "../data/schema";
import { MouseEventHandler } from "react";
import { SheetTrigger } from "@/components/ui/sheet";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onPreviewClick: MouseEventHandler<HTMLButtonElement>;
}

export function DataTableRowActions<TData>({
  row,
  onPreviewClick,
}: DataTableRowActionsProps<TData>) {
  const master = masterSchema.parse(row.original);

  return (
    <div className="flex gap-4 items-center justify-center">
      <SheetTrigger asChild>
        <Button
          value={master.id}
          onClick={onPreviewClick}
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EyeOpenIcon className="h-4 w-4 text-primary" />
          <span className="sr-only">Show preview</span>
        </Button>
      </SheetTrigger>
    </div>
  );
}
