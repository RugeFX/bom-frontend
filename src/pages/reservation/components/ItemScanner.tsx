import { toast } from "@/components/ui/use-toast";
import { useZxing } from "react-zxing";

interface ItemScannerProps {
  onResultChange: (result: string) => void;
  paused: boolean;
}

export default function ItemScanner({ onResultChange, paused }: ItemScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(res) {
      onResultChange(res.getText());
      toast({ title: "Successfully scanned Item!", description: `QR Result : ${res}` });
    },
    timeBetweenDecodingAttempts: 3000,
    paused,
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-black w-full max-w-screen-md h-full rounded-md overflow-hidden aspect-square object-contain">
        <video className="w-full h-full" ref={ref} />
      </div>
    </div>
  );
}
