export interface DonationImpactRate {
  impactCategory: string;
  costPerUnit: number;
  unitLabel: string;
}

// Hardcoded sample rates for local testing.
// These will be replaced by API call to /api/PublicImpact/donation-rates once deployed.
export const SAMPLE_RATES: DonationImpactRate[] = [
  { impactCategory: 'Operations', costPerUnit: 1500, unitLabel: 'month of safe shelter for a girl' },
  { impactCategory: 'Wellbeing', costPerUnit: 420, unitLabel: 'counseling session' },
  { impactCategory: 'Education', costPerUnit: 850, unitLabel: 'month of educational support' },
  { impactCategory: 'Outreach', costPerUnit: 380, unitLabel: 'home visitation to a girl\'s family' },
];

const CATEGORY_ICONS: Record<string, string> = {
  Operations: '\u{1F3E0}',
  Wellbeing: '\u{1F49C}',
  Education: '\u{1F4DA}',
  Outreach: '\u{1F3E1}',
  Maintenance: '\u{1F527}',
  Transport: '\u{1F698}',
};

interface Props {
  amount: number;
  rates: DonationImpactRate[];
}

export default function DonationImpactCards({ amount, rates }: Props) {
  if (amount <= 0 || rates.length === 0) return null;

  const impacts = rates
    .map(rate => ({
      ...rate,
      units: Math.floor(amount / rate.costPerUnit),
    }))
    .filter(r => r.units >= 1)
    .sort((a, b) => b.units - a.units);

  return (
    <div className="mt-5 rounded-xl border border-haven-teal-100 bg-haven-teal-50/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-haven-teal-700 mb-3">
        Your impact
      </p>

      {impacts.length === 0 ? (
        <p className="text-sm text-stone-600 leading-relaxed">
          Every peso contributes toward shelter, counseling, and education for girls in need.
        </p>
      ) : (
        <ul className="space-y-2">
          {impacts.map(item => (
            <li
              key={item.impactCategory}
              className="flex items-start gap-2.5 text-sm text-stone-700"
            >
              <span className="text-base leading-5 shrink-0">
                {CATEGORY_ICONS[item.impactCategory] ?? '\u{2728}'}
              </span>
              <span>
                Could provide{' '}
                <span className="font-bold text-haven-teal-800">{item.units}</span>{' '}
                {item.unitLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
