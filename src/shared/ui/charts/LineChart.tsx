import { useState } from "react";
import { ChartFrame } from "./ChartFrame";
import { chartDomain, formatValue, linePoints, scaleValue } from "./geometry";
import { usePlotWidth } from "./usePlotWidth";
import type { ChartSeries } from "./types";

export function LineChart({
  title,
  description,
  labels,
  series,
}: {
  title: string;
  description: string;
  labels: readonly string[];
  series: readonly ChartSeries[];
}) {
  const [hidden, setHidden] = useState<readonly string[]>([]);
  const [readout, setReadout] = useState("");
  const { ref, width } = usePlotWidth();
  const visible = series.filter((item) => !hidden.includes(item.id));
  const valid = series.every(
    (item) => item.values.length === labels.length && item.values.every(Number.isFinite),
  );
  const domain = chartDomain(visible.flatMap((item) => item.values));
  const ticks = Array.from(
    { length: 5 },
    (_, index) => domain[0] + ((domain[1] - domain[0]) * index) / 4,
  );
  const labelStep = Math.max(
    1,
    Math.ceil(labels.length / Math.max(2, Math.floor((width - 60) / 70))),
  );
  const axisPoints = linePoints(
    labels.map(() => 0),
    domain,
    width,
  );
  function toggle(id: string) {
    setReadout("");
    setHidden((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  }
  return (
    <ChartFrame
      title={title}
      description={description}
      headings={["Period", ...series.map((item) => item.label)]}
      rows={labels.map((label, index) => [
        label,
        ...series.map((item) => item.values[index] ?? "—"),
      ])}
    >
      <div className="chart-legend" role="group" aria-label={`${title} series`}>
        {series.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={!hidden.includes(item.id)}
            onClick={() => toggle(item.id)}
          >
            <span
              className={`chart-key chart-color-${item.color}${index % 2 ? " chart-key-dashed" : ""}`}
              aria-hidden="true"
            />
            {item.label}
          </button>
        ))}
      </div>
      <div ref={ref} className="chart-plot">
        {!valid ? (
          <p className="chart-message" role="status">
            This chart is unavailable.
          </p>
        ) : labels.length === 0 || visible.length === 0 ? (
          <p className="chart-message" role="status">
            {labels.length && series.length
              ? "Select a series to display the chart."
              : "No values to display yet."}
          </p>
        ) : (
          <svg viewBox={`0 0 ${width} 230`} role="group" aria-label={title}>
            {ticks.map((tick) => {
              const y = scaleValue(tick, domain, 192, 24);
              return (
                <g key={tick} aria-hidden="true">
                  <line x1="42" x2={width - 18} y1={y} y2={y} className="chart-grid" />
                  <text x="32" y={y + 4} textAnchor="end" className="chart-label">
                    {formatValue(tick)}
                  </text>
                </g>
              );
            })}
            {labels.map((label, index) => {
              if (index % labelStep !== 0 && index !== labels.length - 1) return null;
              // Reserve enough room for the last label at narrow widths.
              if (index !== labels.length - 1 && labels.length - 1 - index < labelStep) return null;
              const point = axisPoints[index];
              return (
                <text
                  key={index}
                  x={point?.x}
                  y="218"
                  textAnchor={
                    index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"
                  }
                  className="chart-label"
                  aria-hidden="true"
                >
                  {label}
                </text>
              );
            })}
            {visible.map((item) => {
              const points = linePoints(item.values, domain, width);
              const originalIndex = series.findIndex((entry) => entry.id === item.id);
              return (
                <g key={item.id} className={`chart-color-${item.color}`}>
                  <polyline
                    points={points.map((point) => `${point.x},${point.y}`).join(" ")}
                    className="chart-line"
                    strokeDasharray={originalIndex % 2 ? "5 4" : undefined}
                    aria-hidden="true"
                  />
                  {points.map((point, index) => {
                    const label = `${item.label}, ${labels[index]}: ${item.values[index]}`;
                    return (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        className="chart-point"
                        tabIndex={0}
                        role="img"
                        aria-label={label}
                        onFocus={() => setReadout(label)}
                        onBlur={() => setReadout("")}
                        onMouseEnter={() => setReadout(label)}
                        onMouseLeave={() => setReadout("")}
                      >
                        <title>{label}</title>
                      </circle>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        )}
      </div>
      <p className="chart-readout">{readout || "Hover or focus a point to inspect its value."}</p>
    </ChartFrame>
  );
}
