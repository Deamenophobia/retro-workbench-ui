import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chartDomain, linePoints, scaleValue } from "../../src/shared/ui/charts/geometry";
import { BarChart, DonutChart, LineChart } from "../../src/shared/ui";

test("chart scales include zero, signed values and readable outer bounds", () => {
  assert.deepEqual(chartDomain([18, 38, 29]), [0, 40]);
  assert.deepEqual(chartDomain([0, 0]), [0, 1]);
  const signed = chartDomain([-12, 7]);
  assert.ok(signed[0] <= -12 && signed[1] >= 7);
  const zero = scaleValue(0, signed, 100, 500);
  assert.ok(zero > 100 && zero < 500);
});

test("single-point and zero-valued charts have finite, in-bounds geometry", () => {
  assert.deepEqual(linePoints([0], chartDomain([0]), 240), [{ x: 132, y: 192 }]);
  const points = linePoints([-12, 0, 7], chartDomain([-12, 0, 7]), 240);
  assert.ok(points.every((point) => Number.isFinite(point.x) && point.y >= 24 && point.y <= 192));
  const markup = renderToStaticMarkup(
    createElement(BarChart, {
      title: "Empty counts",
      description: "",
      data: [{ label: "Zero", value: 0 }],
    }),
  );
  assert.ok(!markup.includes("NaN"));
});

test("donuts communicate zero totals and reject signed input", () => {
  const render = (value: number) =>
    renderToStaticMarkup(
      createElement(DonutChart, {
        title: "Shares",
        description: "",
        data: [{ label: "A", value }],
      }),
    );
  assert.match(render(0), /No positive values/);
  assert.match(render(-1), /This chart is unavailable/);
  assert.match(render(12), /Total: 12/);
});

test("line charts report missing or mismatched data without invalid SVG coordinates", () => {
  const empty = renderToStaticMarkup(
    createElement(LineChart, { title: "Activity", description: "", labels: [], series: [] }),
  );
  assert.match(empty, /No values to display/);
  const invalid = renderToStaticMarkup(
    createElement(LineChart, {
      title: "Activity",
      description: "",
      labels: ["Mon"],
      series: [{ id: "a", label: "A", color: "blue", values: [1, 2] }],
    }),
  );
  assert.match(invalid, /This chart is unavailable/);
  assert.ok(!invalid.includes("NaN"));
});
