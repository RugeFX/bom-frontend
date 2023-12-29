import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/use-toast";
import { RotateCwIcon } from "lucide-react";
import { useState } from "react";
import { useZxing } from "react-zxing";

export function ItemScannerNew({
  values,
  onSubmit,
}: {
  values: string[];
  onSubmit: (result: string) => void;
}) {
  const [result, setResult] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult(res) {
      console.log(values);
      if (values.includes(res.getText())) {
        toast({
          title: "Scanned Item is already in the list!",
          description: `QR Result: ${res.getText()}`,
          variant: "destructive",
        });
      } else {
        setResult(res.getText());
        toast({
          title: "Successfully scanned Item!",
          description: `QR Result: ${res}`,
        });
      }
    },
    timeBetweenDecodingAttempts: 3000,
    paused: result !== null,
    constraints: { video: { facingMode: "environment" } },
  });

  return (
    <div className="mx-auto h-3/4 w-full max-w-md">
      <DrawerHeader>
        <DrawerTitle>Scan an Item</DrawerTitle>
        <DrawerDescription>Scan and extract an item information from QR Code.</DrawerDescription>
      </DrawerHeader>
      <div className="w-full flex flex-col items-center">
        <div className="bg-black w-full max-w-screen-md h-full rounded-md overflow-hidden aspect-square object-contain">
          <video className="w-full h-full" ref={ref} />
        </div>
      </div>
      {result !== null ? (
        <Card className="my-2">
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full space-y-2">
              <span className="block text-gray-400">Item ID</span>
              <span>{result}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full flex justify-center items-center gap-2"
              variant="outline"
              onClick={() => setResult(null)}
            >
              <RotateCwIcon className="w-4 h-4" />
              Rescan
            </Button>
          </CardFooter>
        </Card>
      ) : null}
      <DrawerFooter>
        <Button
          disabled={result === null || values.includes(result)}
          onClick={() => {
            if (result !== null && !values.includes(result)) {
              onSubmit(result);
            }
          }}
        >
          Submit
        </Button>
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}
