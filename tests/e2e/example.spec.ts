import { test, expect } from "@playwright/test";

test("landing page has hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /citysen/i })).toBeVisible();
});
