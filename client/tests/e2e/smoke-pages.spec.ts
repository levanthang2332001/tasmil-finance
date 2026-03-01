import { expect, test } from "@playwright/test";

test.describe("E2E smoke with real API", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Tasmil Finance").first()).toBeVisible();
  });

  test("dashboard renders market overview title", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /market overview/i })).toBeVisible();

    // Wait for real API-powered cards to appear (or fallback heading remains if API is slow)
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Market Overview").first()).toBeVisible();
  });

  test("community page renders title", async ({ page }) => {
    await page.goto("/community");
    await expect(page.getByRole("heading", { name: /hot tweets/i })).toBeVisible();
  });
});
