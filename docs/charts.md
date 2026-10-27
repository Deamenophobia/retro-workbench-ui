# Charts and graphs

Open `#/charts` for the gallery. The three charts are ordinary React components
rendering SVG; React and React DOM remain the only runtime dependencies. They use
the same markup in Classic and Studio, with color tokens in the theme stylesheets.

```tsx
import { BarChart, DonutChart, LineChart } from "./shared/ui";

<LineChart
  title="Weekly activity"
  description="Two sample series."
  labels={["Mon", "Tue", "Wed"]}
  series={[
    { id: "current", label: "This week", color: "blue", values: [12, 18, 15] },
    { id: "previous", label: "Last week", color: "sage", values: [10, 14, 12] },
  ]}
/>;

<BarChart
  title="By category"
  description="Sample counts."
  data={[
    { label: "Guides", value: 24 },
    { label: "Notes", value: 18 },
  ]}
/>;

<DonutChart
  title="Status"
  description="Share of the collection."
  totalLabel="records"
  data={[
    { label: "Ready", value: 32, color: "blue" },
    { label: "Draft", value: 10, color: "amber" },
  ]}
/>;
```

Import paths depend on the consuming file. Feature code uses `../../shared/ui`.
Optional datum colors are `blue`, `sage`, `amber`, or `brick`; use the semantic
`--chart-*` tokens to adjust their values for each appearance.

Line series need stable unique IDs and one finite number per label. Categories are
equally spaced; this is not a continuous date or logarithmic axis. Line and bar
charts include a zero baseline and support negative values. Donuts require finite,
nonnegative values and show an empty state for zero totals. Inputs with invalid
values or mismatched line lengths produce an unavailable state. Long bar labels
are shortened visually; the data table retains the original text.

Each figure includes an expandable table of exact values. Line legend buttons work
with keyboard or pointer, and line points expose their values through focus and
hover. Solid/dashed line styles distinguish the two sample series in addition to
color. Hiding all series displays a recovery instruction; selecting one restores it.

These components suit small, presentational charts. They intentionally omit
streaming, zooming, large-series virtualization, advanced scales, export, and graph
editing. Bring a specialized library into an application when those needs arise.
The sample values live in `features/charts/examples.ts`; supply your own arrays to
reuse the components without adopting the gallery feature.
