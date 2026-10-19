/** Krymper et bilde i nettleseren til maks `maxSide` px og gjør det om til JPEG før opplasting. */
export async function resizeImage(file: File, maxSide: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas støttes ikke");
  ctx.fillStyle = "#ffffff"; // gjennomsiktige PNG-er får hvit bakgrunn
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Kunne ikke lage bilde"))), "image/jpeg", 0.85),
  );
}
