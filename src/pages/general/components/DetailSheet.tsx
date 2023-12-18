import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetGeneralDetails from "@/hooks/query/general/useGetGeneralDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import { General } from "@/types/general";

export default function DetailSheet({ id, open }: { id: number; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetGeneralDetails(id, {
    enabled: open,
  });
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
          isSuccess && <Details data={data.data} />
        )}
      </div>
    </SheetContent>
  );
}

function Details({ data }: { data: General }) {
  return (
    <>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Item Code</span>
        <h3 className="font-semibold">{data.item_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Name</span>
        <h3 className="font-semibold">{data.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Color</span>
        <h3 className="font-semibold">{data.color?.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Quantity</span>
        <h3 className="font-semibold">{data.quantity}</h3>
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
    </>
  );
}
