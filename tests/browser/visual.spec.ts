import { expect, test } from "@playwright/test";

for (const theme of ["classic", "studio"]) {
  test(`${theme} visual contracts`, async ({ page }) => {
    await page.goto("/#/records");
    await page.getByLabel("Appearance", { exact: true }).selectOption(theme);
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page).toHaveScreenshot(`${theme}-records.png`);
    await page
      .getByRole("navigation", { name: "Workspace", exact: true })
      .getByRole("link", { name: "Components" })
      .click();
    await expect(page).toHaveScreenshot(`${theme}-collections.png`);
    await page.getByRole("tab", { name: "Advanced inputs" }).click();
    await page.getByRole("combobox", { name: "Resource owner", exact: true }).click();
    await expect(page).toHaveScreenshot(`${theme}-selection.png`);
    await page.getByRole("combobox", { name: "Resource owner", exact: true }).press("Escape");
    await expect(page.getByRole("region", { name: "Dates and periods" })).toHaveScreenshot(
      `${theme}-dates.png`,
    );
    await page.getByLabel("Attachments", { exact: true }).setInputFiles({
      name: "review-notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Fictional review notes."),
    });
    await page.getByLabel("Example file progress").fill("35");
    await expect(page.getByRole("region", { name: "Files and progress" })).toHaveScreenshot(
      `${theme}-files.png`,
    );
    await page.getByRole("tab", { name: "Navigation & overlays" }).click();
    await page.getByRole("button", { name: "Rename collection", exact: true }).click();
    await expect(page).toHaveScreenshot(`${theme}-dialog.png`);
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("tab", { name: "Advanced inputs" }).click();
    await expect(page).toHaveScreenshot(`${theme}-narrow-inputs.png`);
  });
}
