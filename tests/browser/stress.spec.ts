import { expect, test } from "@playwright/test";

test("long records remain inside the table scroll region at constrained widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route("**/demo-records.json", (route) =>
    route.fulfill({
      json: [
        {
          id: "long",
          name: "A".repeat(180),
          owner: "An owner with a very long display name",
          category: "Document",
          status: "Ready",
          updated: "2026-10-27",
        },
      ],
    }),
  );
  await page.goto("/#/records");
  await expect(page.getByRole("table")).toBeVisible();
  expect(
    await page.getByRole("main").evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const table = page.getByRole("region", { name: "Workspace records" });
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
});

test("enlarged text keeps navigation, fields and constrained popups usable", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/components");
  await page.addStyleTag({
    content:
      ":root { --text-base: 26px; --text-sm: 22px; --text-xs: 20px; --text-lg: 32px; --text-title: 48px; }",
  });
  await page.getByRole("tab", { name: "Advanced inputs" }).click();
  const owner = page.getByRole("combobox", { name: "Resource owner", exact: true });
  await owner.fill("sam");
  await owner.press("ArrowDown");
  await owner.press("Enter");
  await expect(owner).toHaveValue("Sam Chen");
  await expect(page.getByRole("navigation", { name: "Workspace", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(
    await page.getByRole("main").evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("enlarged-text.png") });
});
