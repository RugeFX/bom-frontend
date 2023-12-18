import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useGetGeneralDetails from "@/hooks/query/general/useGetGeneralDetails";
import GeneralForm from "./GeneralForm";

export default function UpdateSheet({
  id,
  open,
  onSuccess,
}: {
  id: number;
  open: boolean;
  onSuccess: (id: number) => void;
}) {
  const { data, isLoading, isError, isSuccess } = useGetGeneralDetails(id, {
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
          isSuccess && <GeneralForm mode="update" data={data.data} onSuccess={onSuccess} />
        )}
      </div>
    </SheetContent>
  );
}
