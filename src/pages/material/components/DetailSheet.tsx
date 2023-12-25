import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetMaterialDetails from "@/hooks/query/material/useGetMaterialDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import type { MaterialItem } from "@/types/material";
import { extractModelFromValue } from "@/lib/models";

export default function DetailSheet({
  itemCode,
  open,
}: {
  itemCode: string | null;
  open: boolean;
}) {
  const { data, isLoading, isError, isSuccess } = useGetMaterialDetails(itemCode, {
    enabled: open && itemCode !== null,
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

function Details({ data }: { data: MaterialItem }) {
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
        <span className="text-muted-foreground text-sm">Model</span>
        <h3 className="font-semibold">{extractModelFromValue(data.model)?.label}</h3>
      </div>
      <Separator />
      {data.attributes.size !== null && (
        <>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Size</span>
            <h3 className="font-semibold">{data.attributes.size.name}</h3>
          </div>
          <Separator />
        </>
      )}
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
