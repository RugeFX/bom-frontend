import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import PlanForm from "./PlanForm";
import useGetPlanDetails from "@/hooks/query/plan/useGetPlanDetails";

export default function EditSheet({
  id,
  open,
  onSuccess,
}: {
  id: number | null;
  open: boolean;
  onSuccess: (id: number) => void;
}) {
  const { data, isLoading, isError, isSuccess } = useGetPlanDetails(id, {
    enabled: open,
  });

  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Edit plan</SheetTitle>
        <SheetDescription>Update the details of an plan.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <Skeleton className="w-full h-[20px] rounded-full" />
        ) : isError ? (
          <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
            Error loading details!
          </h2>
        ) : (
          isSuccess && <PlanForm mode="update" data={data.data} onSuccess={onSuccess} />
        )}
      </div>
    </SheetContent>
  );
}
