import { useRef } from "react";
import QRCode from "react-qr-code";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { QrCodeIcon } from "lucide-react";

export default function QRGenerator({ dataBatch }: { dataBatch: string[] }) {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();

    dataBatch.forEach((data, index) => {
      if (!qrCodeRef.current) return;

      const nowIso = new Date().toISOString();

      const svg = qrCodeRef.current.getElementsByTagName("svg")[index];
      svg.setAttribute("width", "500");
      svg.setAttribute("height", "500");
      const svgData = new XMLSerializer().serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image(500, 500);

      img.onload = async () => {
        canvas.width = img.width + 200;
        canvas.height = img.height + 100;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          (canvas.width - svg.width.baseVal.value) / 2,
          (canvas.width - svg.height.baseVal.value) / 5
        );

        ctx.font = "30px Arial";
        const text = `${data}`;
        const textWidth = ctx.measureText(text).width;

        const textX = (canvas.width - textWidth) / 2;
        const textY = canvas.height - 20;

        ctx.fillStyle = "black";
        ctx.fillText(text, textX, textY);

        const pngFile = canvas.toDataURL("image/png");

        zip.file(`qrcode_${data}_${nowIso}.png`, pngFile.split(";base64,")[1], {
          base64: true,
        });

        if (index === dataBatch.length - 1) {
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(zipBlob);
          link.download = `qritems_${nowIso}.zip`;
          link.click();
        }
      };

      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    });
  };

  return (
    <>
      <div className="hidden" ref={qrCodeRef}>
        {dataBatch.map((data, index) => (
          <QRCode key={index} value={data} />
        ))}
      </div>
      <Button variant="outline" size="sm" className="h-8 flex gap-2" onClick={downloadAllQRCodes}>
        <QrCodeIcon className="w-4 h-4" />
        Generate QR
      </Button>
    </>
  );
}
