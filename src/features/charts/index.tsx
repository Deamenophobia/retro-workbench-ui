import { useState } from "react";
import { BarChart, DonutChart, LineChart, PageHeading, Panel } from "../../shared/ui";
import { activity, categories, statuses } from "./examples";
import "./charts-page.css";

export function ChartsPage() {
  const [range, setRange] = useState<"week" | "month">("week");
  const current = activity[range];
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Charts"
        title="Charts & graphs"
        description="A few clear ways to see the bigger picture."
      />
      <div className="page-body">
        <Panel
          title="Activity over time"
          actions={
            <label className="chart-range">
              <span>Range</span>
              <select
                aria-label="Chart range"
                value={range}
                onChange={(event) => setRange(event.target.value === "month" ? "month" : "week")}
              >
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
            </label>
          }
        >
          <LineChart
            title="Activity over time"
            description="Activity compared with the previous period. Select a legend to show or hide a series."
            labels={current.labels}
            series={current.series}
          />
        </Panel>
        <div className="chart-gallery-grid">
          <Panel title="By category">
            <BarChart
              title="Records by category"
              description="A simple comparison across four categories."
              data={categories}
            />
          </Panel>
          <Panel title="Status overview">
            <DonutChart
              title="Records by status"
              description="How the collection is distributed."
              data={statuses}
              totalLabel="sample records"
            />
          </Panel>
        </div>
        <p className="chart-gallery-note">
          Illustrative sample values · Hover or focus line points to inspect them. Open “View data”
          for exact values.
        </p>
      </div>
    </>
  );
}
