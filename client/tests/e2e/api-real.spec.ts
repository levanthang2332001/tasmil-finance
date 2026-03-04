import { expect, test } from "@playwright/test";

test.describe("Real API integration", () => {
  test("dashboard market endpoint returns valid shape", async ({ request }) => {
    const response = await request.get("/api/dashboard/market?symbols=BTCUSD,ETHUSD,SOLUSD,APTUSD");
    expect(response.ok(), `status=${response.status()} body=${await response.text()}`).toBeTruthy();

    const payload = await response.json();
    expect(Array.isArray(payload)).toBeTruthy();
    expect(payload.length).toBeGreaterThan(0);

    const firstGroup = payload[0];
    expect(Array.isArray(firstGroup)).toBeTruthy();
    expect(firstGroup.length).toBeGreaterThan(0);

    const firstToken = firstGroup[0];
    expect(firstToken).toHaveProperty("symbol");
    expect(firstToken).toHaveProperty("price");
  });

  test("community cursor endpoint returns cursor", async ({ request }) => {
    const response = await request.get("/api/community/batches/cursor");
    expect(response.ok(), `status=${response.status()} body=${await response.text()}`).toBeTruthy();

    const payload = await response.json();
    const cursor = Number(payload?.cursor);
    expect(Number.isFinite(cursor)).toBeTruthy();
    expect(cursor).toBeGreaterThanOrEqual(0);
  });
});
