import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useZxing } from "react-zxing";

export default function ScannerPage() {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(res) {
      setResult(res.getText());
      toast({ title: "Successfully scanned QR Code!", description: `QR Result : ${res}` });
    },
    timeBetweenDecodingAttempts: 3000,
  });

  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Scan</h1>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="bg-black w-full max-w-screen-md max-h-screen rounded-md overflow-hidden">
          <video className="w-full aspect-[9/16]" ref={ref} />
        </div>
        <p>
          <span>Last result:</span>
          <span>{result}</span>
        </p>
      </div>
    </main>
  );
}
