import { DotsHorizontalIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { itemSchema } from "../../data/schema";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import DetailSheet from "../DetailSheet";
import { useState } from "react";
import useDeleteItem from "@/hooks/query/items/useDeleteItem";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({ row, table }: DataTableRowActionsProps<TData>) {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const data = itemSchema.pick({ code: true }).safeParse(row.original);

  const { toast } = useToast();
  const { mutateAsync: deleteMutate } = useDeleteItem();

  const onDelete = async () => {
    try {
      if (!data.success) return;

      const { code } = data.data;
      await deleteMutate({ code, model: "hardcase" });

      toast({
        title: "Successfully deleted item",
        description: `Item with the code "${code}" has been deleted.`,
        variant: "default",
      });
    } catch (e) {
      console.error(e);

      toast({
        title: "Failed deleting size",
        description: "An unexpected error has occured.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DetailSheet id={data.success ? data.data.code : null} open={detailsOpen} />
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <EyeOpenIcon className="h-4 w-4 text-primary" />
            <span className="sr-only">Show preview</span>
          </Button>
        </SheetTrigger>
      </Sheet>
      <AlertDialog>
        <DeleteDialog onSubmit={onDelete} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {data.success && (
              <DropdownMenuItem
                onClick={() => table.options.meta?.item?.onUpdateClick(data.data.code)}
              >
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <AlertDialogTrigger className="w-full">Delete</AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  );
}
