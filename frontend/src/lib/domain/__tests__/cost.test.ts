import { describe, expect, it } from "vitest";
import { calcMaterialFee, calcRentalFee, calcTotal } from "../cost";

describe("calcRentalFee", () => {
  it("multiplies hours by hourly rate", () => {
    expect(calcRentalFee(4, 15000)).toBe(60000);
  });

  it("rounds fractional hour totals", () => {
    expect(calcRentalFee(1.5, 20000)).toBe(30000);
  });
});

describe("calcMaterialFee", () => {
  it("sums unit price times quantity across items", () => {
    const total = calcMaterialFee([
      { name: "구리 촉매 시약", unitPrice: 1000, qty: 2 },
      { name: "반응 용매", unitPrice: 500, qty: 3 },
    ]);
    expect(total).toBe(3500);
  });

  it("returns 0 for an empty item list", () => {
    expect(calcMaterialFee([])).toBe(0);
  });
});

describe("calcTotal", () => {
  it("combines rental and material fees with a per-item breakdown", () => {
    const result = calcTotal(4, 15000, [
      { name: "배양 배지", unitPrice: 20000, qty: 3 },
    ]);
    expect(result.rental).toBe(60000);
    expect(result.material).toBe(60000);
    expect(result.total).toBe(120000);
    expect(result.breakdown).toEqual([
      { name: "배양 배지", unitPrice: 20000, qty: 3, subtotal: 60000 },
    ]);
  });

  it("handles no materials", () => {
    const result = calcTotal(2, 10000, []);
    expect(result).toEqual({ rental: 20000, material: 0, total: 20000, breakdown: [] });
  });
});
