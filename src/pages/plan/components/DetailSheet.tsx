import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetPlanDetails from "@/hooks/query/plan/useGetPlanDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import type { Plan } from "@/types/plan";

export default function DetailSheet({ id, open }: { id: number | null; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetPlanDetails(id, {
    enabled: open && id !== null,
  });

  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Plan details</SheetTitle>
        <SheetDescription>See the details of an plan.</SheetDescription>
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

function Details({ data }: { data: Plan }) {
  return (
    <>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Plan Code</span>
        <h3 className="font-semibold">{data.plan_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Name</span>
        <h3 className="font-semibold">{data.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Address</span>
        <h3 className="font-semibold">{data.address}</h3>
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
