import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetMasterDetails from "@/hooks/query/master/useGetMasterDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import { Category } from "@/types/category";
import { Master } from "@/types/master";

export default function MasterDetailSheet({ id }: { id: number }) {
  const { data, isLoading, isError, isSuccess } = useGetMasterDetails(id, {
    enabled: !!id,
  });
  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Master details</SheetTitle>
        <SheetDescription>See the details of a master.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <Skeleton className="w-full h-[20px] rounded-full" />
        ) : isError ? (
          <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
            Error loading details!
          </h2>
        ) : (
          isSuccess && <MasterDetails master={data.data} />
        )}
      </div>
    </SheetContent>
  );
}

function MasterDetails({ master }: { master: Master & { category: Category } }) {
  return (
    <>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Master Code</span>
        <h3 className="font-semibold">{master.master_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Category</span>
        <h3 className="font-semibold">{master.category.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Created At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(master.created_at)}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Updated At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(master.updated_at)}</h3>
      </div>
      <Separator />
    </>
  );
}
