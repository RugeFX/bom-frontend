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
import { Skeleton } from "@/components/ui/skeleton";
import useGetItemDetails from "@/hooks/query/items/useGetItemDetails";
import { ItemModelValues } from "@/lib/models";
import { CheckCircleIcon, CircleDotDashedIcon, MapPinnedIcon } from "lucide-react";
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
  const { data, isLoading, isError, isSuccess } = useGetItemDetails(code, model, { enabled: open });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ScrollArea className="max-h-96">
      {isLoading ? (
        <Skeleton className="w-full h-[20px] rounded-lg" />
      ) : isError ? (
        <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
          Error loading record!
        </h2>
      ) : isSuccess && data.data.reservation && data.data.reservation.length ? (
        <div className="space-y-2">
          {data.data.reservation
            .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
            .map((reservation) => {
              return (
                <div key={reservation.id} className="px-5 py-3 border border-border rounded-md">
                  <div className="space-y-2">
                    <div className="flex gap-5 items-center">
                      <CircleDotDashedIcon className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Pickup</span>
                        <h2 className="font-medium">{reservation.pickupPlan_code}</h2>
                      </div>
                    </div>
                    {reservation.returnPlan_code ? (
                      <div className="flex gap-5 items-center">
                        <CheckCircleIcon className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">Return</span>
                          <h2 className="font-medium">{reservation.returnPlan_code}</h2>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="flex items-center gap-5 px-5 py-3 border border-border rounded-md">
          <h2 className="text-center font-semibold p-2">No Track Records found.</h2>
        </div>
      )}
    </ScrollArea>
  );
}
