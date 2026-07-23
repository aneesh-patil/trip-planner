import { describe, it, expect, vi } from "vitest";
import { triggerPdfPrint } from "../PdfExportService";

describe("PdfExportService Unit Tests", () => {
  it("triggers browser print dialog when environment matches browser context", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    triggerPdfPrint();
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
