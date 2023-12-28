import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetItemDetails from "@/hooks/query/items/useGetItemDetails";
import { ItemModelValues } from "@/lib/models";
import { MapPinnedIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TrackRecordDialogProps {
  code: string;
  model: ItemModelValues;
}

export default function TrackRecordDialog({ code, model }: TrackRecordDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full flex justify-center items-center gap-2">
          <MapPinnedIcon className="w-4 h-4" /> Show Track Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{code}'s Track Record</DialogTitle>
          <DialogDescription>See a reservation's detailed track record.</DialogDescription>
        </DialogHeader>
        <TrackRecordContent code={code} model={model} open={open} />
      </DialogContent>
    </Dialog>
  );
}

function TrackRecordContent({
  code,
  model,
  open,
}: {
  code: string;
  model: ItemModelValues;
  open: boolean;
}) {
  const { data } = useGetItemDetails(code, model, { enabled: open });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <ScrollArea className="max-h-96">{code}</ScrollArea>;
}
