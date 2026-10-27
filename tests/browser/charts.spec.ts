import { expect, test } from "@playwright/test";

test("line legends toggle series and recover from an empty selection", async ({ page }) => {
  await page.goto("/#/charts");
  const line = page.getByRole("figure", { name: "Activity over time", exact: true });
  const current = line.getByRole("button", { name: "This period", exact: true });
  const previous = line.getByRole("button", { name: "Previous period", exact: true });
  await expect(line.getByRole("img", { name: "This period, Mon: 18", exact: true })).toBeVisible();
  await current.click();
  await expect(current).toHaveAttribute("aria-pressed", "false");
  await expect(line.getByRole("img", { name: "This period, Mon: 18", exact: true })).toHaveCount(0);
  await previous.click();
  await expect(line.getByRole("status")).toHaveText("Select a series to display the chart.");
  await current.press("Space");
  await expect(current).toHaveAttribute("aria-pressed", "true");
  const point = line.getByRole("img", { name: "This period, Mon: 18", exact: true });
  await point.focus();
  await expect(
    line.getByText("This period, Mon: 18", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
});

test("range changes update plotted values and accessible data", async ({ page }) => {
  await page.goto("/#/charts");
  await page.getByLabel("Chart range", { exact: true }).selectOption("month");
  const line = page.getByRole("figure", { name: "Activity over time", exact: true });
  await expect(
    line.getByRole("img", { name: "This period, Week 1: 118", exact: true }),
  ).toBeVisible();
  await line.locator("summary").click();
  await expect(line.getByRole("row", { name: "Week 4 164 138" })).toBeVisible();
  const bar = page.getByRole("figure", { name: "Records by category", exact: true });
  await bar.locator("summary").click();
  await expect(bar.getByRole("row", { name: "Guides 24" })).toBeVisible();
  const donut = page.getByRole("figure", { name: "Records by status", exact: true });
  await donut.locator("summary").click();
  await expect(donut.getByRole("row", { name: "Ready 32" })).toBeVisible();
});

for (const theme of ["classic", "studio"]) {
  test(`${theme} charts remain readable within their viewport`, async ({ page }, testInfo) => {
    await page.goto("/#/charts");
    await page.getByLabel("Appearance", { exact: true }).selectOption(theme);
    const main = page.getByRole("main");
    await expect
      .poll(() => main.evaluate((element) => element.scrollWidth <= element.clientWidth))
      .toBe(true);
    for (const title of ["Activity over time", "Records by category", "Records by status"]) {
      const chart = page.getByRole("figure", { name: title, exact: true });
      await chart.scrollIntoViewIfNeeded();
      await expect(chart).toBeVisible();
      const bounds = await chart.boundingBox();
      expect(bounds?.width).toBeGreaterThan(180);
      await chart.screenshot({
        path: testInfo.outputPath(`${theme}-${title.replaceAll(" ", "-")}.png`),
      });
    }
    if (testInfo.project.name === "chromium") {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await main.evaluate((element) => element.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`${theme}-gallery.png`) });
    }
  });
}
