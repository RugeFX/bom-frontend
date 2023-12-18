import { DotsHorizontalIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { masterSchema } from "../data/schema";
import { MouseEventHandler } from "react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SheetTrigger } from "@/components/ui/sheet";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onPreviewClick: MouseEventHandler<HTMLButtonElement>;
  onDeleteClick: MouseEventHandler<HTMLButtonElement>;
}

export function DataTableRowActions<TData>({
  row,
  onPreviewClick,
  onDeleteClick,
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <AlertDialogTrigger className="w-full" value={master.id} onClick={onDeleteClick}>
              Delete
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
