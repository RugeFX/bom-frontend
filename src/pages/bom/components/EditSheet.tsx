import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetBomDetails from "@/hooks/query/bom/useGetBomDetails";
import BOMForm from "./BOMForm";

export default function EditSheet({
  id,
  open,
  onSuccess,
}: {
  id: number;
  open: boolean;
  onSuccess: (id: number) => void;
}) {
  const { data, isLoading, isError, isSuccess } = useGetBomDetails(id, {
    enabled: open,
    refetchOnMount: false,
  });

  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Edit item</SheetTitle>
        <SheetDescription>Update the details of an item.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <Skeleton className="w-full h-[20px] rounded-full" />
        ) : isError ? (
          <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
            Error loading details!
          </h2>
        ) : (
          isSuccess && <BOMForm mode="update" data={data.data} onSuccess={onSuccess} />
        )}
      </div>
    </SheetContent>
  );
}
