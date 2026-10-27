import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function audit(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
}

for (const theme of ["classic", "studio"]) {
  test(`${theme} pages, inputs, open listboxes and dialogs have no detected accessibility violations`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto("/");
    await page.getByLabel("Appearance", { exact: true }).selectOption(theme);
    for (const route of ["overview", "records", "charts", "settings", "guide", "components"]) {
      await page
        .getByRole("navigation", { name: "Workspace", exact: true })
        .getByRole("link", { name: route, exact: false })
        .click();
      if (route === "records") await expect(page.getByRole("table")).toBeVisible();
      await audit(page);
    }
    for (const group of ["Forms", "Advanced inputs", "Navigation & overlays", "Feedback"]) {
      await page.getByRole("tab", { name: group, exact: true }).click();
      await audit(page);
    }
    await page.getByRole("tab", { name: "Advanced inputs" }).click();
    const owner = page.getByRole("combobox", { name: "Resource owner", exact: true });
    await owner.click();
    await owner.press("ArrowDown");
    await audit(page);
    await owner.press("Escape");
    await page.getByRole("tab", { name: "Navigation & overlays" }).click();
    await page.getByRole("button", { name: "Rename collection", exact: true }).click();
    await audit(page);
  });
}
