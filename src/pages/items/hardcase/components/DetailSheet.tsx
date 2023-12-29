import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetItemDetails from "@/hooks/query/items/useGetItemDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import { type Schema, itemSchema } from "../data/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";
import TrackRecordDialog from "../../components/TrackRecordDialog";
import { onQRDownload } from "../../utils";

export default function DetailSheet({ id, open }: { id: string | null; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetItemDetails(id, "hardcase", {
    enabled: open && id !== null,
  });
  const parsedData = itemSchema.safeParse(data?.data);

  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Item details</SheetTitle>
        <SheetDescription>See the details of an item.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <Skeleton className="w-full h-[20px] rounded-full" />
        ) : isError ? (
          <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
            Error loading details!
          </h2>
        ) : (
          isSuccess && parsedData.success && <Details data={parsedData.data} />
        )}
      </div>
    </SheetContent>
  );
}

function Details({ data }: { data: Schema }) {
  return (
    <>
      <div className="flex justify-start">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <QrCodeIcon className="w-5 h-5" />
              <span className="sm:block hidden">Generate QR Code</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>QR Code for item : {data.name}</DialogDescription>
            </DialogHeader>
            <div className="w-full p-5 bg-white rounded-md grid place-items-center">
              <QRCode id="qr-code" value={data.code} />
            </div>
            <DialogFooter>
              <Button
                variant="default"
                className="w-full flex gap-2"
                onClick={() => onQRDownload(data.code)}
              >
                <DownloadIcon className="w-4 h-4" />
                Download QR Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Code</span>
        <h3 className="font-semibold">{data.code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Plan</span>
        <h3 className="font-semibold">{data.plan?.name ?? "-"}</h3>
        <h3 className="text-gray-400">{data.plan?.address ?? "-"}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">BOM Code</span>
        <h3 className="font-semibold">{data.bom_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Name</span>
        <h3 className="font-semibold">{data.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Information</span>
        <h3 className="font-semibold">{data.information ?? "-"}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Status</span>
        <h3 className="font-semibold">{data.status}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Created At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(data.created_at)}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Updated At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(data.updated_at)}</h3>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">Track Record</span>
        <TrackRecordDialog code={data.code} model="hardcase" />
      </div>
      <Separator />
    </>
  );
}
