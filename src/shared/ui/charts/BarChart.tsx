import { ChartFrame } from "./ChartFrame";
import { chartDomain, formatValue, scaleValue } from "./geometry";
import { usePlotWidth } from "./usePlotWidth";
import type { ChartDatum } from "./types";

export function BarChart({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: readonly ChartDatum[];
}) {
  const { ref, width } = usePlotWidth();
  const domain = chartDomain(data.map((item) => item.value));
  const left = Math.min(104, width * 0.34);
  const right = width - 42;
  const labelLimit = Math.max(5, Math.floor((left - 12) / 6));
  const zero = scaleValue(0, domain, left, right);
  const height = Math.max(160, data.length * 46 + 18);
  return (
    <ChartFrame
      title={title}
      description={description}
      headings={["Category", "Value"]}
      rows={data.map((item) => [item.label, item.value])}
    >
      <div ref={ref} className="chart-plot">
        {data.length === 0 ? (
          <p className="chart-message" role="status">
            No values to display yet.
          </p>
        ) : !data.every((item) => Number.isFinite(item.value)) ? (
          <p className="chart-message" role="status">
            This chart is unavailable.
          </p>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
            <line x1={zero} x2={zero} y1="12" y2={height - 10} className="chart-grid" />
            {data.map((item, index) => {
              const endpoint = scaleValue(item.value, domain, left, right);
              const y = 12 + index * 46;
              return (
                <g key={index} className={`chart-color-${item.color ?? "blue"}`}>
                  <title>{`${item.label}: ${item.value}`}</title>
                  <text x={left - 12} y={y + 19} textAnchor="end" className="chart-label">
                    {item.label.length > labelLimit
                      ? `${item.label.slice(0, labelLimit - 1)}…`
                      : item.label}
                  </text>
                  <rect
                    x={Math.min(zero, endpoint)}
                    y={y}
                    width={Math.abs(endpoint - zero)}
                    height="28"
                    className="chart-bar"
                  />
                  <text x={right + 12} y={y + 19} className="chart-value">
                    {formatValue(item.value)}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </ChartFrame>
  );
}
