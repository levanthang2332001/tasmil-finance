export const DASHBOARD_PERIODS = [
  '1D',
  '3D',
  '5D',
  '1W',
  '1M',
  '3M',
  '6M',
  '1Y',
] as const;

export type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number];

export function isDashboardPeriod(value?: string): value is DashboardPeriod {
  return !!value && DASHBOARD_PERIODS.includes(value as DashboardPeriod);
}

export function parseCsvQuery(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseDashboardPeriod(
  value?: string,
  fallback: DashboardPeriod = '1M',
): DashboardPeriod {
  return isDashboardPeriod(value) ? value : fallback;
}
