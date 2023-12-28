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
import { MapPinnedIcon } from "lucide-react";
import { useState } from "react";

interface TrackRecordDialogProps {
  code: string;
}

export default function TrackRecordDialog({ code }: TrackRecordDialogProps) {
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
        <TrackRecordContent code={code} />
      </DialogContent>
    </Dialog>
  );
}

export function TrackRecordContent({ code }: { code: string }) {
  return <ScrollArea className="max-h-96">{code}</ScrollArea>;
}
