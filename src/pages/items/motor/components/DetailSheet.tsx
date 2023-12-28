import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetItemDetails from "@/hooks/query/items/useGetItemDetails";
import { cn, parseDateStringToLocale } from "@/lib/utils";
import { type Schema, itemSchema } from "../data/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import TrackRecordDialog from "../../components/TrackRecordDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";

export default function DetailSheet({ id, open }: { id: string | null; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetItemDetails(id, "motor", {
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
  const onQRDownload = () => {
    const svg = document.getElementById("qr-code")!;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas")!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height + 100;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      const text = `${data.code}`;
      const textWidth = ctx.measureText(text).width;

      const textX = (canvas.width - textWidth) / 2;
      const textY = canvas.height - 20;

      ctx.fillText(text, textX, textY);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a")!;
      downloadLink.download = `QRItem-${data.code}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

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
            <div className="w-full grid place-items-center">
              <QRCode id="qr-code" value={data.code} />
            </div>
            <DialogFooter>
              <Button variant="default" className="w-full flex gap-2" onClick={onQRDownload}>
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
        <span className="text-muted-foreground text-sm">Generals</span>
        <GeneralsList items={data.general} />
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Hardcase code</span>
        {data.hardcase_code ? (
          <h3 className="font-semibold">{data.hardcase_code}</h3>
        ) : (
          <h3 className="text-muted-foreground">None</h3>
        )}
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
        <TrackRecordDialog code={data.code} model="motor" />
      </div>
      <Separator />
    </>
  );
}

function GeneralsList({
  items,
}: {
  items: {
    code: string;
    bom_code: string;
    plan_code: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    information?: string | null | undefined;
  }[];
}) {
  return (
    <ul className="flex flex-wrap justify-start gap-2">
      {items.length ? (
        items.map((mat) => {
          return mat ? (
            <li key={mat.code}>
              <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                  <div
                    // TODO: Profile page
                    // to={`/materials?details=${item.item_code}`}
                    className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                  >
                    <span className="pointer-events-none">{mat.code}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Code</span>
                      <span className="font-semibold">{mat.code}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Name</span>
                      <span className="font-semibold">{mat.name}</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </li>
          ) : null;
        })
      ) : (
        <li>
          <span>No items found.</span>
        </li>
      )}
    </ul>
  );
}
