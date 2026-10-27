import { useId, type ReactNode } from "react";

export function ChartFrame({
  title,
  description,
  headings,
  rows,
  children,
}: {
  title: string;
  description: string;
  headings: readonly string[];
  rows: readonly (readonly (string | number)[])[];
  children: ReactNode;
}) {
  const id = useId();
  return (
    <figure className="chart" aria-labelledby={id}>
      <figcaption>
        <span className="sr-only" id={id}>
          {title}
        </span>
        <p className="chart-description">{description}</p>
      </figcaption>
      {children}
      <details className="chart-data">
        <summary>
          View data<span className="sr-only"> for {title}</span>
        </summary>
        <div className="table-scroll" role="region" aria-label={`${title} data`} tabIndex={0}>
          <table>
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                {headings.map((heading, index) => (
                  <th key={index} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, column) => (
                    <td key={column}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
