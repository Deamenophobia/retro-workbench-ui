/** Presentation coordinates only; no aggregation or domain calculations. */
export function chartDomain(values: readonly number[]): [number, number] {
  let low = 0;
  let high = 0;
  for (const value of values) {
    low = Math.min(low, value);
    high = Math.max(high, value);
  }
  if (low === high) return [0, 1];
  const roughStep = (high - low) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const fraction = roughStep / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude;
  return [Math.floor(low / step) * step, Math.ceil(high / step) * step];
}

export function scaleValue(
  value: number,
  domain: readonly [number, number],
  start: number,
  end: number,
) {
  return start + ((value - domain[0]) / (domain[1] - domain[0])) * (end - start);
}

export function linePoints(
  values: readonly number[],
  domain: readonly [number, number],
  width: number,
) {
  const left = 42;
  const right = width - 18;
  return values.map((value, index) => ({
    x:
      values.length === 1
        ? (left + right) / 2
        : left + (index / (values.length - 1)) * (right - left),
    y: scaleValue(value, domain, 192, 24),
  }));
}

export function formatValue(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: Math.abs(value) >= 10000 ? "compact" : "standard",
  }).format(value);
}
