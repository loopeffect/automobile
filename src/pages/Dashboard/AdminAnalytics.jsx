import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const fetchAnalytics = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get('/api/analytics/admin', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

/** Premium KPI card (light + dark, glassy, visible) */
const StatCard = ({ label, value, color = 'blue' }) => {
  const accents = {
    blue: {
      ring: 'ring-blue-200/70 dark:ring-blue-500/20',
      glow: 'from-blue-500/18 via-blue-500/10 to-transparent dark:from-blue-500/20 dark:via-blue-500/10',
      dot: 'bg-blue-500',
      chip: 'bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-500/20',
    },
    green: {
      ring: 'ring-emerald-200/70 dark:ring-emerald-500/20',
      glow: 'from-emerald-500/18 via-emerald-500/10 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10',
      dot: 'bg-emerald-500',
      chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20',
    },
    yellow: {
      ring: 'ring-amber-200/70 dark:ring-amber-500/20',
      glow: 'from-amber-500/18 via-amber-500/10 to-transparent dark:from-amber-500/20 dark:via-amber-500/10',
      dot: 'bg-amber-500',
      chip: 'bg-amber-50 text-amber-800 ring-amber-200/70 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-500/20',
    },
    red: {
      ring: 'ring-rose-200/70 dark:ring-rose-500/20',
      glow: 'from-rose-500/18 via-rose-500/10 to-transparent dark:from-rose-500/20 dark:via-rose-500/10',
      dot: 'bg-rose-500',
      chip: 'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/20',
    },
  };

  const a = accents[color] || accents.blue;

  return (
    <div
      className={[
        'relative overflow-hidden rounded-3xl p-5',
        'bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl',
        'ring-1',
        a.ring,
        'shadow-[0_14px_40px_-28px_rgba(2,6,23,0.5)] dark:shadow-[0_14px_40px_-28px_rgba(0,0,0,0.9)]',
      ].join(' ')}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${a.glow}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ${a.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            {label}
          </div>
          <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value?.toLocaleString?.() ?? '—'}
          </p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/70 dark:bg-slate-950/40 ring-1 ring-slate-200/70 dark:ring-slate-800/70 shadow-sm flex items-center justify-center">
          <span className={`h-2.5 w-2.5 rounded-full ${a.dot} shadow-[0_0_0_6px_rgba(59,130,246,0.10)]`} />
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div className="flex items-end justify-between gap-3 flex-wrap">
    <div>
      <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-300/80 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, right }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200/70 dark:ring-slate-800/70 shadow-[0_14px_40px_-28px_rgba(2,6,23,0.5)]">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-28 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/14 to-violet-500/10 blur-3xl dark:from-blue-500/18 dark:to-violet-500/14" />
      <div className="absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/10 to-sky-500/10 blur-3xl dark:from-emerald-500/12 dark:to-sky-500/12" />
    </div>

    <div className="relative px-6 py-5 border-b border-slate-100/80 dark:border-slate-800/80 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-300/80">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 font-semibold">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>

    <div className="relative px-4 sm:px-6 py-5">{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl
                 ring-1 ring-slate-200/80 dark:ring-slate-800/80
                 px-3 py-2 shadow-[0_20px_60px_-30px_rgba(2,6,23,0.55)]
                 text-xs"
      style={{ zIndex: 9999 }}
    >
      {label && (
        <p className="text-slate-500 dark:text-slate-300/70 mb-1 font-semibold">
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-extrabold text-slate-900 dark:text-white">
              {p.name}
            </span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white">
            {p.value?.toLocaleString?.()}
          </span>
        </div>
      ))}
    </div>
  );
};
const Skeleton = () => (
  <div className="space-y-5">
    <div className="h-7 w-44 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-[108px] rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="h-[360px] rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
      <div className="h-[360px] rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
    </div>
  </div>
);

export default function AdminAnalytics() {
  useAuth(); // keep as-is (even if unused)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Skeleton />
      </div>
    );

  if (isError)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-rose-200/70 dark:ring-rose-500/20 p-6">
          <p className="text-rose-600 dark:text-rose-300 font-extrabold">Failed to load analytics.</p>
          <p className="text-slate-600 dark:text-slate-300/80 text-sm mt-1">
            Please refresh the page or try again in a moment.
          </p>
        </div>
      </div>
    );

  const {
    totals,
    listingsByStatus,
    newUsersPerDay,
    newListingsPerDay,
    topMakes,
    usersByRole,
    priceBuckets,
    engagement,
  } = data;

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-10">
      {/* KPI Cards */}
      <div className="space-y-4">
        <SectionTitle
          title="Platform Overview"
          subtitle="Key performance indicators at a glance."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Users" value={totals.totalUsers} color="blue" />
          <StatCard label="Active Listings" value={totals.totalListings} color="green" />
          <StatCard label="Dealers" value={totals.totalDealers} color="blue" />
          <StatCard label="Pending Review" value={totals.pendingListings} color="yellow" />
          <StatCard label="Inspections" value={totals.totalInspections} color="blue" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Total Listing Views" value={engagement.totalViews} color="blue" />
          <StatCard label="Total Saves" value={engagement.totalSaves} color="green" />
        </div>
      </div>

      {/* Growth Charts */}
      <div className="space-y-4">
        <SectionTitle
          title="Growth Trends"
          subtitle="Last 30 days activity across core metrics."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="New Users Per Day" subtitle="Daily signups">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={newUsersPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                  tickFormatter={(v) => v.slice(5)}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" name="Users" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="New Listings Per Day" subtitle="Daily inventory additions">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={newListingsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                  tickFormatter={(v) => v.slice(5)}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" name="Listings" stroke="#22c55e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="space-y-4">
        <SectionTitle
          title="Distribution"
          subtitle="Breakdowns across marketplace status, roles, and pricing."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard title="Listings by Status" subtitle="Share of inventory states">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={listingsByStatus}
                  cx="60%"
                  cy="50%"
                  outerRadius={86}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {listingsByStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Users by Role" subtitle="Role distribution">  
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={usersByRole}
                  cx="60%"
                  cy="50%"
                  outerRadius={86}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {usersByRole.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Price Distribution (QAR)" subtitle="Listings by price range">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priceBuckets} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 9, fill: 'rgba(100,116,139,1)' }}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                  axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                  tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Listings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Top Makes */}
      <div className="space-y-4">
        <SectionTitle
          title="Top Makes"
          subtitle="Most frequently listed vehicle manufacturers."
        />

        <ChartCard title="Most Listed Vehicle Makes" subtitle="Ranked by listing count">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={topMakes} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
              />
              <YAxis
                type="category"
                dataKey="make"
                tick={{ fontSize: 10, fill: 'rgba(100,116,139,1)' }}
                width={80}
                axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Listings" radius={[0, 10, 10, 0]}>
                {topMakes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}