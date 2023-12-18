import { DotsHorizontalIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generalSchema } from "../data/schema";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import DeleteDialog from "./DeleteDialog";
import DetailSheet from "./DetailSheet";
import { useToast } from "@/components/ui/use-toast";
import useDeleteGeneral from "@/hooks/query/general/useDeleteGeneral";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEditClick: (id: number) => void;
}

export function DataTableRowActions<TData>({ row, onEditClick }: DataTableRowActionsProps<TData>) {
  const general = generalSchema.parse(row.original);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const { toast } = useToast();
  const { mutateAsync: deleteGeneralMutate } = useDeleteGeneral();

  const onDelete = async (id: number) => {
    try {
      await deleteGeneralMutate({ id: String(id) });

      toast({
        title: "Successfully deleted item",
        description: `Item with the id "${id}" has been deleted.`,
        variant: "default",
      });
    } catch (e) {
      console.error(e);

      toast({
        title: "Failed deleting item",
        description: "An unexpected error has occured.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DetailSheet id={general.id} open={detailsOpen} />
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <EyeOpenIcon className="h-4 w-4 text-primary" />
            <span className="sr-only">Show preview</span>
          </Button>
        </SheetTrigger>
      </Sheet>
      <AlertDialog>
        <DeleteDialog onSubmit={() => onDelete(general.id)} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => onEditClick(general.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialogTrigger className="w-full">Delete</AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  );
}
