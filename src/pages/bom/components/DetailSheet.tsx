import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetBomDetails from "@/hooks/query/bom/useGetBomDetails";
import { cn, parseDateStringToLocale } from "@/lib/utils";
import { BOM, MaterialBOM } from "@/types/bom";

export default function DetailSheet({ id, open }: { id: number; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetBomDetails(id, {
    enabled: open,
  });
  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>BOM details</SheetTitle>
        <SheetDescription>See the details of a BOM.</SheetDescription>
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

function Details({ data }: { data: BOM }) {
  return (
    <>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">BOM Code</span>
        <h3 className="font-semibold">{data.bom_code}</h3>
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
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Items</span>
        <MaterialList materials={data.material} />
      </div>
      <Separator />
    </>
  );
}

function MaterialList({ materials }: { materials: MaterialBOM }) {
  return (
    <ul className="flex flex-wrap justify-start gap-2">
      {materials.length ? (
        materials.map((mat) => {
          const item = mat.general ?? mat.hardcase ?? mat.helmet ?? mat.medicine;
          return item ? (
            <li key={mat.item_code}>
              <Link
                to={`/materials?details=${item.item_code}`}
                className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
              >
                <span>{item.item_code}</span>
              </Link>
            </li>
          ) : (
            <li key={mat.item_code}>
              <span>No item.</span>
            </li>
          );
        })
      ) : (
        <li>
          <span>No items found.</span>
        </li>
      )}
    </ul>
  );
}
