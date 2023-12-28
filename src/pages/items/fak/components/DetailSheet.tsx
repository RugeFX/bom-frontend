import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetItemDetails from "@/hooks/query/items/useGetItemDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import { type Schema, itemSchema } from "../data/schema";
import TrackRecordDialog from "../../components/TrackRecordDialog";

export default function DetailSheet({ id, open }: { id: string | null; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetItemDetails(id, "fak", {
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
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Code</span>
        <h3 className="font-semibold">{data.code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Plan Code</span>
        <h3 className="font-semibold">{data.plan_code}</h3>
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
        <h3 className="font-semibold">{data.information}</h3>
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
        <TrackRecordDialog code={data.code} model="fak" />
      </div>
      <Separator />
    </>
  );
}
