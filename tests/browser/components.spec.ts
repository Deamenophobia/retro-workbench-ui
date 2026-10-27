import { expect, test, type Page } from "@playwright/test";

async function group(page: Page, name: string) {
  await page.getByRole("tab", { name, exact: true }).click();
}

test("lists, cards and pagination share feature state without coupling their controls", async ({
  page,
}) => {
  await page.goto("/#/components");
  const list = page.getByRole("list", { name: "Sample resources" });
  const pages = page.getByRole("navigation", { name: "Resource pages", exact: true });
  await expect(list.getByRole("listitem")).toHaveCount(3);
  await expect(pages.getByRole("button", { name: "Previous page" })).toBeDisabled();
  const save = page.getByRole("button", { name: "Save Workspace handbook" });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status").filter({ hasText: "1 saved" })).toBeVisible();
  await pages.getByRole("button", { name: "Next page" }).click();
  await expect(list).toContainText("Reference library");
  await expect(list).not.toContainText("Workspace handbook");
  await expect(pages.getByRole("button", { name: "Next page" })).toBeDisabled();
  await page.getByLabel("Resource pages: items per page").selectOption("5");
  await expect(pages.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(list.getByRole("listitem")).toHaveCount(5);
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear saved resources" }).click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
});

test("drawer keeps background inert, restores its trigger and closes when navigating away", async ({
  page,
}) => {
  await page.goto("/#/components");
  const trigger = page.getByRole("button", { name: "View handbook" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Workspace handbook" });
  await expect(drawer).toBeVisible();
  await page.locator(".workspace-nav a").first().focus();
  expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.goto("/#/records");
  await expect(page.getByRole("heading", { name: "Record directory" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("record pagination resets on filters and page size, clamps after refresh, and handles empty results", async ({
  page,
}) => {
  await page.goto("/#/records");
  const pages = page.getByRole("navigation", { name: "Record pages", exact: true });
  await expect(pages.getByRole("status")).toHaveText("1–5 of 8");
  await pages.getByRole("button", { name: "Next page" }).click();
  await expect(pages.getByRole("status")).toHaveText("6–8 of 8");
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(3);
  await page.getByLabel("Search records").fill("Sam");
  await expect(pages.getByRole("status")).toHaveText("1–3 of 3");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await pages.getByRole("button", { name: "Next page" }).click();
  await page.getByLabel("Record pages: items per page").selectOption("10");
  await expect(pages.getByRole("status")).toHaveText("1–8 of 8");
  await page.getByLabel("Record pages: items per page").selectOption("5");
  await pages.getByRole("button", { name: "Next page" }).click();
  await page.route("**/demo-records.json", (route) =>
    route.fulfill({
      json: [
        {
          id: "one",
          name: "Only record",
          owner: "Sam",
          category: "Document",
          status: "Ready",
          updated: "2026-10-27",
        },
      ],
    }),
  );
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(pages.getByRole("status")).toHaveText("1–1 of 1");
  await page.unroute("**/demo-records.json");
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(pages.getByRole("status")).toHaveText("1–5 of 8");
  await page.getByLabel("Search records").fill("absent-resource");
  await expect(pages.getByRole("status")).toHaveText("0–0 of 0");
  for (const button of await pages.getByRole("button").all()) await expect(button).toBeDisabled();
});

test("form controls validate, support keyboard choices and preserve drafts across tabs and appearances", async ({
  page,
}) => {
  await page.goto("/#/components");
  await group(page, "Forms");
  await page.getByRole("button", { name: "Preview resource" }).click();
  const title = page.getByLabel("Resource title");
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await title.fill("Team notes");
  await page.getByRole("radio", { name: "Workspace", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: "Only me" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Public (unavailable)" })).toBeDisabled();
  const toggle = page.getByRole("switch", { name: "Notify on changes" });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await page.getByRole("checkbox", { name: "Include a summary" }).uncheck();
  await expect(page.getByRole("checkbox", { name: "Automatic publishing" })).toBeDisabled();
  await page.getByLabel("Appearance", { exact: true }).selectOption("studio");
  await group(page, "Collections");
  await group(page, "Forms");
  await expect(title).toHaveValue("Team notes");
  await page.getByRole("button", { name: "Preview resource" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Preview only:" })).toContainText(
    "Only me · No summary · Notifications on",
  );
  await page.getByRole("button", { name: "Reset example" }).click();
  await expect(title).toHaveValue("");
  await expect(toggle).not.toBeChecked();
});

test("dialog supports focus containment, Escape cancellation, validation and explicit save", async ({
  page,
}) => {
  await page.goto("/#/components");
  await group(page, "Navigation & overlays");
  const trigger = page.getByRole("button", { name: "Rename collection", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Rename collection", exact: true });
  const input = dialog.getByLabel("Collection name");
  await expect(input).toBeFocused();
  await input.fill("Discarded name");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(input).toHaveValue("Reading room");
  await input.fill("  ");
  await expect(dialog.getByRole("button", { name: "Apply name" })).toBeDisabled();
  await input.fill("Quiet room");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).focus();
  for (let step = 0; step < 6; step += 1) {
    await page.keyboard.press("Tab");
    // Native dialogs may let Tab visit browser chrome, but never background controls.
    expect(
      await dialog.evaluate(
        (element) =>
          document.activeElement === document.body || element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await input.focus();
  await page.locator(".workspace-nav a").first().focus();
  await expect(input).toBeFocused();
  await dialog.getByRole("button", { name: "Apply name" }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByText("Quiet room", { exact: true })).toBeVisible();
});

test("popover, tooltip, menus and accordion support keyboard dismissal and activation", async ({
  page,
}) => {
  await page.goto("/#/components");
  await group(page, "Navigation & overlays");
  const trigger = page.getByRole("button", { name: "About this collection" });
  const popover = page.getByRole("region", { name: "Collection details" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(popover).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(popover.getByRole("button", { name: "Close Collection details" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator(".workspace-status").click();
  await expect(popover).toBeHidden();
  const tooltipTrigger = page.getByRole("button", { name: "Preview information" });
  await tooltipTrigger.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toBeHidden();
  await expect(tooltipTrigger).toBeFocused();
  await trigger.focus();
  await tooltipTrigger.hover();
  await page.getByRole("tooltip").hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.locator(".workspace-status").hover();
  await expect(page.getByRole("tooltip")).toBeHidden();
  const accordion = page.locator("summary").filter({ hasText: "Can I use the keyboard?" });
  await accordion.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Use Tab to move between controls", { exact: false })).toBeVisible();
  const menu = page.locator("summary").filter({ hasText: "Collection actions" });
  await menu.click();
  await expect(page.getByRole("button", { name: "Delete collection" })).toBeDisabled();
  await page.getByRole("button", { name: "Mark as reviewed" }).click();
  await expect(menu).toBeFocused();
  await expect(page.getByText("Collection marked as reviewed for this preview.")).toBeVisible();
});

test("feedback states recover, progress updates and toast announcements can be dismissed", async ({
  page,
}) => {
  await page.goto("/#/components");
  await group(page, "Feedback");
  const pages = page.getByRole("navigation", { name: "State preview pages" });
  await expect(page.getByText("Loading resources…")).toBeVisible();
  for (const button of await pages.getByRole("button").all()) await expect(button).toBeDisabled();
  await page.getByLabel("Preview state").selectOption("empty");
  await page.getByRole("button", { name: "Show sample resource" }).click();
  await expect(page.getByText("The sample resource is ready.")).toBeVisible();
  await page.getByLabel("Preview state").selectOption("error");
  await expect(page.getByRole("alert").filter({ hasText: "Resources unavailable" })).toBeVisible();
  await page.getByRole("button", { name: "Retry preview" }).click();
  await expect(page.getByText("The sample resource is ready.")).toBeVisible();
  await page.getByLabel("Preview progress").fill("100");
  await expect(page.getByRole("progressbar", { name: "Preparing resources" })).toHaveAttribute(
    "value",
    "100",
  );
  await page.getByRole("button", { name: "Show error", exact: true }).click();
  const toast = page.getByRole("complementary", { name: "Notifications" });
  await expect(toast.getByRole("alert")).toContainText("could not be prepared");
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toast.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Show error", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Show success", exact: true }).click();
  await expect(toast.getByRole("status")).toContainText("Your preview is ready.");
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(page.getByRole("button", { name: "Show success", exact: true })).toBeFocused();
});

for (const theme of ["classic", "studio"]) {
  test(`${theme} component gallery and overlays fit the viewport`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/#/components");
    await page.getByLabel("Appearance", { exact: true }).selectOption(theme);
    for (const name of ["Collections", "Forms", "Navigation & overlays", "Feedback"]) {
      await group(page, name);
      expect(
        await page
          .getByRole("main")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({
        path: testInfo.outputPath(`${theme}-${name.replace(/\W+/g, "-")}.png`),
      });
      if (name === "Collections" && testInfo.project.name === "narrow") {
        await page
          .getByRole("heading", { name: "Resource list", exact: true })
          .scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`${theme}-list.png`) });
        await page
          .getByRole("navigation", { name: "Resource pages", exact: true })
          .scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`${theme}-pagination.png`) });
      }
    }
    if (testInfo.project.name === "chromium") {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await group(page, "Collections");
      await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`${theme}-gallery.png`) });
      await page.setViewportSize({ width: 1280, height: 800 });
    }
    await group(page, "Navigation & overlays");
    await page.getByRole("button", { name: "Rename collection", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Rename collection" });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    await page.screenshot({ path: testInfo.outputPath(`${theme}-dialog.png`) });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "About this collection" }).click();
    const popup = page.getByRole("region", { name: "Collection details" });
    await expect(popup).toBeVisible();
    await expect
      .poll(() =>
        popup.evaluate((element) => {
          const box = element.getBoundingClientRect();
          return (
            box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight
          );
        }),
      )
      .toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${theme}-popover.png`) });
    expect(errors).toEqual([]);
  });
}
