import { expect, test, type Page } from "@playwright/test";

const nav = (page: Page) => page.getByRole("navigation", { name: "Workspace", exact: true });

test("Classic default, both appearances persist across routes and reloads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
  await expect(page.locator(".workspace-header")).toHaveCSS("background-color", "rgb(48, 53, 59)");
  await page.getByLabel("Appearance", { exact: true }).selectOption("studio");
  await nav(page).getByRole("link", { name: "Records", exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "studio");
  await page.getByLabel("Appearance", { exact: true }).selectOption("classic");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
});

test("navigation, browser history, unknown route recovery and registered extension page", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page).getByRole("link", { name: "Records", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await nav(page).getByRole("link", { name: "Guide", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A quick guide" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Record directory" })).toBeVisible();
  await page.goForward();
  await expect(nav(page).getByRole("link", { name: "Guide", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.goto("/#/missing");
  await page.getByRole("link", { name: "Return to overview" }).click();
  await expect(page.getByRole("heading", { name: "A place for everyday work" })).toBeVisible();
});

test("record search, status filters, empty state and clear action", async ({ page }) => {
  await page.goto("/#/records");
  await expect(page.getByText("8 matching records")).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear", exact: true })).toBeDisabled();
  await page.getByLabel("Search records").fill("Sam");
  await expect(page.getByText("3 matching records")).toBeVisible();
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("Draft");
  await expect(page.getByText("1 matching records")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Review checklist", exact: true })).toBeVisible();
  await page.getByLabel("Search records").fill("not-present");
  await expect(page.getByRole("heading", { name: "No records found" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("8 matching records")).toBeVisible();
});

test("loading, network failure, retry and invalid responses", async ({ page }) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/demo-records.json", async (route) => {
    await gate;
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  await page.goto("/#/records");
  await expect(page.getByText("Loading records…")).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeDisabled();
  release();
  await expect(page.getByRole("alert")).toContainText("Records could not be loaded");
  await page.unroute("**/demo-records.json");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("8 matching records")).toBeVisible();
  await page.route("**/demo-records.json", (route) => route.fulfill({ json: [{ broken: true }] }));
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.getByRole("alert")).toContainText("Records could not be loaded");
});

test("an older pending request cannot replace a newer search", async ({ page }) => {
  await page.goto("/#/records");
  await expect(page.getByText("8 matching records")).toBeVisible();
  let oldRequest: (() => Promise<void>) | undefined;
  let releaseOld: () => void = () => {};
  let oldFinished: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    oldFinished = resolve;
  });
  const gate = new Promise<void>((resolve) => {
    releaseOld = resolve;
  });
  let count = 0;
  await page.route("**/demo-records.json", async (route) => {
    count += 1;
    if (count === 1) {
      oldRequest = () =>
        route.fulfill({
          json: [
            {
              id: "old",
              name: "Old guide",
              owner: "Old",
              category: "Document",
              status: "Ready",
              updated: "2026-10-01",
            },
          ],
        });
      await gate;
      await oldRequest();
      oldFinished();
    } else await route.continue();
  });
  await page.getByLabel("Search records").fill("Old");
  await expect.poll(() => Boolean(oldRequest)).toBe(true);
  await page.getByLabel("Search records").fill("Sam");
  await expect(page.getByText("3 matching records")).toBeVisible();
  releaseOld();
  await finished;
  await expect(page.getByRole("cell", { name: "Old guide" })).toHaveCount(0);
  await expect(page.getByText("3 matching records")).toBeVisible();
});

test("settings validate, discard, save, and use persisted start page", async ({ page }) => {
  await page.goto("/#/settings");
  await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
  await page.getByLabel("Workspace name").fill("   ");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Enter a workspace name.")).toBeVisible();
  await expect(page.getByLabel("Workspace name")).toBeFocused();
  await page.getByRole("button", { name: "Discard changes" }).click();
  await expect(page.getByLabel("Workspace name")).toHaveValue("Sample workspace");
  await page.getByLabel("Workspace name").fill("Design room");
  await page.getByLabel("Appearance", { exact: true }).selectOption("studio");
  await page.getByRole("tab", { name: "About & storage" }).click();
  await page.getByRole("tab", { name: "General", exact: true }).click();
  await expect(page.getByLabel("Workspace name")).toHaveValue("Design room");
  await page.getByLabel("Start page").selectOption("records");
  await page.getByLabel("Show helpful sidebar notes").uncheck();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Workspace settings saved in this browser.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "At your fingertips" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("Workspace name")).toHaveValue("Design room");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Record directory" })).toBeVisible();
});

test("blocked storage preserves form edits and allows session appearance", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "QuotaExceededError");
    };
  });
  await page.goto("/#/settings");
  await page.getByLabel("Appearance", { exact: true }).selectOption("studio");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "studio");
  await expect(page.getByText(/Appearance applied for this session/)).toBeVisible();
  await page.getByLabel("Workspace name").fill("Keep my draft");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert")).toContainText("Settings could not be saved");
  await expect(page.getByLabel("Workspace name")).toHaveValue("Keep my draft");
  await expect(page.getByRole("button", { name: "Save changes" })).toBeEnabled();
});

test("corrupt preferences fall back and remain recoverable", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("retro-workbench.appearance.v1", "broken");
    localStorage.setItem("retro-workbench.settings.v1", "{bad json");
  });
  await page.goto("/#/settings");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
  await expect(page.getByText(/Saved settings could not be read/)).toBeVisible();
  await page.getByLabel("Workspace name").fill("Recovered");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Saved settings could not be read/)).toHaveCount(0);
});

test("keyboard tabs, menu dismissal and skip link", async ({ page }) => {
  await page.goto("/#/settings");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("tab", { name: "General", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "About & storage" })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Your browser, your workspace" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "General", exact: true })).toBeFocused();
  const menu = page.locator("summary").filter({ hasText: "Help" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link", { name: "Quick guide", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.getByRole("link", { name: "Quick guide", exact: true })).toBeHidden();
  await menu.click();
  await page.locator(".workspace-status").click();
  await expect(page.getByRole("link", { name: "Quick guide", exact: true })).toBeHidden();
});

for (const theme of ["classic", "studio"]) {
  test(`${theme} responsive layout, internal table scrolling and screenshots`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByLabel("Appearance", { exact: true }).selectOption(theme);
    for (const route of ["overview", "records", "charts", "components", "settings", "guide"]) {
      await nav(page).getByRole("link", { name: route, exact: false }).click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route === "records") await expect(page.getByRole("table")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(nav(page)).toBeVisible();
      expect(
        await page
          .getByRole("main")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
      await expect(page.getByLabel("Appearance", { exact: true })).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath(`${theme}-${route}.png`) });
    }
    await nav(page).getByRole("link", { name: "Records", exact: true }).click();
    const scrollRegion = page.getByRole("region", { name: "Workspace records" });
    await expect(scrollRegion).toBeVisible();
    const widths = await scrollRegion.evaluate((element) => ({
      content: element.scrollWidth,
      viewport: element.clientWidth,
    }));
    if (testInfo.project.name === "narrow") {
      expect(widths.content).toBeGreaterThan(widths.viewport);
      await scrollRegion.focus();
      await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => scrollRegion.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
  });
}
