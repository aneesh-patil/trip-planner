export function triggerPdfPrint(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
