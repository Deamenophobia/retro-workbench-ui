import { expect, test } from "@playwright/test";

test("table sorts, selects across pages, clears filters and toggles columns", async ({ page }) => {
  await page.goto("/#/records");
  const table = page.getByRole("table", { name: "Workspace records" });
  await table.getByRole("button", { name: "Name", exact: true }).click();
  await expect(table.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await expect(table.locator("tbody tr").first()).toContainText("Archive index");
  await table.getByRole("button", { name: "Name", exact: true }).click();
  await expect(table.locator("tbody tr").first()).toContainText("Writing guidelines");
  await table.getByRole("checkbox", { name: "Select Writing guidelines" }).check();
  const all = table.getByRole("checkbox", { name: "Select page", exact: true });
  await expect(all).toHaveJSProperty("indeterminate", true);
  await all.check();
  await expect(page.getByText("5 selected across pages")).toBeVisible();
  await page.getByRole("button", { name: "Next page" }).click();
  await table.getByRole("checkbox", { name: "Select page", exact: true }).check();
  await expect(page.getByText("8 selected across pages")).toBeVisible();
  await page.getByRole("button", { name: "Columns", exact: true }).click();
  const columns = page.getByRole("region", { name: "Visible columns" });
  await expect(columns.getByRole("checkbox", { name: "Name", exact: true })).toBeDisabled();
  await columns.getByRole("checkbox", { name: "Owner", exact: true }).uncheck();
  await columns.getByRole("button", { name: "Close Visible columns" }).click();
  await expect(table.getByRole("columnheader", { name: "Owner" })).toHaveCount(0);
  await page.getByLabel("Search records").fill("Sam");
  await expect(page.getByText("0 selected across pages")).toBeVisible();
});

test("combobox filters, commits with keyboard, preserves a value on Escape and handles disabled or absent options", async ({
  page,
}) => {
  await page.goto("/#/components");
  await page.getByRole("tab", { name: "Advanced inputs" }).click();
  const owner = page.getByRole("combobox", { name: "Resource owner", exact: true });
  await owner.fill("sam");
  await owner.press("ArrowDown");
  await expect(owner).toHaveAttribute("aria-activedescendant", /option-0$/);
  await owner.press("Enter");
  await expect(owner).toHaveValue("Sam Chen");
  await owner.fill("unmatched");
  await expect(page.getByText("No matching options.")).toBeVisible();
  await owner.press("Escape");
  await expect(owner).toHaveValue("Sam Chen");
  await owner.fill("riley");
  await page.getByRole("option", { name: /Riley Park/ }).click({ force: true });
  await owner.press("Escape");
  await expect(owner).toHaveValue("Sam Chen");
  await owner.fill("other text");
  await owner.press("Tab");
  await expect(owner).toHaveValue("Sam Chen");
  await page.getByRole("button", { name: "Clear Resource owner" }).click();
  await expect(owner).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Owner preview (disabled)" })).toBeDisabled();
  await owner.press("Escape");
  const catalog = page.getByRole("combobox", { name: "Catalog reference" });
  await catalog.click();
  await catalog.press("End");
  await catalog.press("Enter");
  await expect(catalog).toHaveValue("Reference 250");
  await catalog.fill("017");
  await page.getByRole("option", { name: "Reference 017", exact: true }).click();
  await expect(catalog).toHaveValue("Reference 017");
});

test("multiple selection toggles choices and returns focus after removing a tag", async ({
  page,
}) => {
  await page.goto("/#/components");
  await page.getByRole("tab", { name: "Advanced inputs" }).click();
  const input = page.getByRole("combobox", { name: "Resource labels", exact: true });
  await input.fill("check");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page.getByRole("option", { name: "Checklist", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await input.fill("note");
  await input.press("ArrowDown");
  await input.press("Enter");
  await input.press("Escape");
  await expect(
    page.getByRole("list", { name: "Selected Resource labels" }).getByRole("listitem"),
  ).toHaveCount(3);
  await page.getByRole("button", { name: "Remove Checklist", exact: true }).click();
  await expect(input).toBeFocused();
  await input.press("Escape");
  await expect(page.getByRole("button", { name: "Remove Checklist", exact: true })).toHaveCount(0);
});

test("native dates preserve date-only values and range validation can recover", async ({
  page,
}) => {
  await page.goto("/#/components");
  await page.getByRole("tab", { name: "Advanced inputs" }).click();
  await page.getByLabel("Due date", { exact: true }).fill("2026-11-01");
  await page.getByLabel("Start date", { exact: true }).fill("2026-11-02");
  await page.getByRole("button", { name: "Preview dates" }).click();
  await expect(page.getByText("Choose both dates for the review period.")).toBeVisible();
  await page.getByLabel("End date", { exact: true }).fill("2026-11-01");
  await page.getByRole("button", { name: "Preview dates" }).click();
  await expect(page.getByText("The end date must be on or after the start date.")).toBeVisible();
  await page.getByLabel("End date", { exact: true }).fill("2026-11-04");
  await page.getByRole("button", { name: "Preview dates" }).click();
  await expect(page.getByText("Due: 2026-11-01. Review: 2026-11-02 to 2026-11-04.")).toBeVisible();
});

test("file choice and dropping validate, report errors, remove and reselect, and respect disabled state", async ({
  page,
}) => {
  await page.goto("/#/components");
  await page.getByRole("tab", { name: "Advanced inputs" }).click();
  const input = page.getByLabel("Attachments", { exact: true });
  const sample = {
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("fictional sample"),
  };
  await input.setInputFiles([
    sample,
    { name: "bad.pdf", mimeType: "application/pdf", buffer: Buffer.from("invalid sample") },
  ]);
  await expect(page.getByRole("button", { name: "Remove notes.txt" })).toBeVisible();
  await expect(page.getByText("bad.pdf: File type is not accepted.")).toBeVisible();
  await input.setInputFiles({
    name: "large.txt",
    mimeType: "text/plain",
    buffer: Buffer.alloc(1024 * 1024 + 1),
  });
  await expect(page.getByText("large.txt: File exceeds the size limit.")).toBeVisible();
  await page.getByLabel("Example file progress").fill("75");
  await expect(page.getByRole("progressbar", { name: "notes.txt progress" })).toHaveAttribute(
    "value",
    "75",
  );
  await page.getByRole("button", { name: "Remove notes.txt" }).click();
  await expect(input).toBeFocused();
  await input.setInputFiles(sample);
  await expect(page.getByRole("button", { name: "Remove notes.txt" })).toBeVisible();
  const dropped = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(["sample"], "dropped.md", { type: "text/markdown" }));
    return transfer;
  });
  await page.locator(".file-picker").dispatchEvent("drop", { dataTransfer: dropped });
  await expect(page.getByRole("button", { name: "Remove dropped.md" })).toBeVisible();
  await page.getByRole("button", { name: "Disable file controls" }).click();
  await expect(input).toBeDisabled();
  await expect(page.getByRole("button", { name: "Remove notes.txt" })).toBeDisabled();
  await dropped.dispose();
});
