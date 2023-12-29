export const onQRDownload = (code: string) => {
  const svgGet = document.getElementById("qr-code")!;
  const svg = svgGet.cloneNode(true) as SVGSVGElement;
  svg.setAttribute("width", "500");
  svg.setAttribute("height", "500");

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas")!;
  const ctx = canvas.getContext("2d")!;
  const img = new Image(500, 500);
  img.onload = () => {
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
    const text = `${code}`;
    const textWidth = ctx.measureText(text).width;

    const textX = (canvas.width - textWidth) / 2;
    const textY = canvas.height - 20;

    ctx.fillStyle = "black";
    ctx.fillText(text, textX, textY);

    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a")!;
    downloadLink.download = `qritem-${code}`;
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
};
