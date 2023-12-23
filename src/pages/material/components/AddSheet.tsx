import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import MaterialForm from "./MaterialForm";

export default function AddSheet({ onSuccess }: { onSuccess: (itemCode: string) => void }) {
  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Add item</SheetTitle>
        <SheetDescription>Create a new item.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <MaterialForm mode="add" onSuccess={onSuccess} />
      </div>
    </SheetContent>
  );
}
