import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import GeneralForm from "./GeneralForm";

export default function AddSheet({ onSuccess }: { onSuccess: (id: number) => void }) {
  return (
    <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Add item</SheetTitle>
        <SheetDescription>Create a new item.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        <GeneralForm mode="add" onSuccess={onSuccess} />
      </div>
    </SheetContent>
  );
}
