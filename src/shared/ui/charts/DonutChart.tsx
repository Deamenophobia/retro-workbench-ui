import { ChartFrame } from "./ChartFrame";
import { formatValue } from "./geometry";
import { chartColors, type ChartDatum } from "./types";

export function DonutChart({
  title,
  description,
  data,
  totalLabel = "Total",
}: {
  title: string;
  description: string;
  data: readonly ChartDatum[];
  totalLabel?: string;
}) {
  const valid = data.every((item) => Number.isFinite(item.value) && item.value >= 0);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const segments = data.map((item) => {
    const length = total > 0 ? (item.value / total) * 100 : 0;
    const segment = { ...item, offset, length };
    offset += length;
    return segment;
  });
  return (
    <ChartFrame
      title={title}
      description={description}
      headings={["Category", "Value"]}
      rows={data.map((item) => [item.label, item.value])}
    >
      {!valid || !Number.isFinite(total) ? (
        <p className="chart-message" role="status">
          This chart is unavailable.
        </p>
      ) : total === 0 ? (
        <p className="chart-message" role="status">
          No positive values to display yet.
        </p>
      ) : (
        <div className="chart-donut-layout">
          <svg
            viewBox="0 0 220 220"
            className="chart-donut"
            role="img"
            aria-label={`${title}. ${totalLabel}: ${total}`}
          >
            <circle cx="110" cy="110" r="78" className="chart-ring-track" />
            {segments.map(
              (segment, index) =>
                segment.length > 0 && (
                  <circle
                    key={index}
                    cx="110"
                    cy="110"
                    r="78"
                    pathLength="100"
                    strokeDasharray={`${segment.length} ${100 - segment.length}`}
                    strokeDashoffset={-segment.offset}
                    transform="rotate(-90 110 110)"
                    className={`chart-ring chart-color-${segment.color ?? chartColors[index % chartColors.length]}`}
                  >
                    <title>{`${segment.label}: ${segment.value} (${formatValue(segment.length)}%)`}</title>
                  </circle>
                ),
            )}
            <text x="110" y="108" textAnchor="middle" className="chart-total">
              {formatValue(total)}
            </text>
            <text x="110" y="130" textAnchor="middle" className="chart-label">
              {totalLabel}
            </text>
          </svg>
          <ul className="chart-breakdown">
            {segments.map((segment, index) => (
              <li key={index}>
                <span
                  className={`chart-swatch chart-color-${segment.color ?? chartColors[index % chartColors.length]}`}
                  aria-hidden="true"
                />
                <span>{segment.label}</span>
                <strong>{formatValue(segment.value)}</strong>
                <span className="muted">{formatValue(segment.length)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartFrame>
  );
}
