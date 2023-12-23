import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import BOMForm from "./BOMForm";

export default function AddSheet({ onSuccess }: { onSuccess: (id: number) => void }) {
  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Add BOM</SheetTitle>
        <SheetDescription>Create a new BOM.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <BOMForm mode="add" onSuccess={onSuccess} />
      </div>
    </SheetContent>
  );
}
