import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetReservationDetails from "@/hooks/query/reservation/useGetReservationDetails";
import { parseDateStringToLocale } from "@/lib/utils";
import type { Reservation } from "@/types/reservation";

export default function DetailSheet({ id, open }: { id: number | null; open: boolean }) {
  const { data, isLoading, isError, isSuccess } = useGetReservationDetails(id, {
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

function Details({ data }: { data: Reservation }) {
  return (
    <>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Reservation Code</span>
        <h3 className="font-semibold">{data.reservation_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Pickup Plan Code</span>
        <h3 className="font-semibold">{data.pickupPlan_code}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Return Plan Code</span>
        <h3 className="font-semibold">{data.returnPlan_code ?? "-"}</h3>
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
    </>
  );
}
