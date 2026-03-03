import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { dealersAPI } from '../../services/api';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const fetchDealerAnalytics = async () => {
  const { data } = await dealersAPI.getMyAnalytics();
  return data.data;
};

const StatCard = ({ label, value, sub, color = 'blue' }) => {
  const map = {
    blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green:  'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <div className={`rounded-2xl border p-5 ${map[color]}`}>
      <p className="text-xs font-medium opacity-60 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-black mt-1">{value?.toLocaleString() ?? '—'}</p>
      {sub && <p className="text-xs mt-1 opacity-50">{sub}</p>}
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wide">{title}</h3>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function DealerAnalytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dealer-analytics'],
    queryFn: fetchDealerAnalytics,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (isError) return (
    <div className="text-center py-20 text-red-500">Failed to load analytics. Please refresh the page.</div>
  );

  const totals = data?.totals || {};
  const byStatus = Array.isArray(data?.byStatus) ? data.byStatus : [];
  const topListings = Array.isArray(data?.topListings) ? data.topListings : [];
  const listingsPerMonth = Array.isArray(data?.listingsPerMonth) ? data.listingsPerMonth : [];
  const bodyTypeBreakdown = Array.isArray(data?.bodyTypeBreakdown) ? data.bodyTypeBreakdown : [];
  const dealer = data?.dealer || {};

  return (
    <div className="space-y-8">

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings"  value={totals.active}      color="green" />
        <StatCard label="Pending Review"   value={totals.pending}     color="yellow" />
        <StatCard label="Sold"             value={totals.sold}        color="blue" />
        <StatCard label="Total Views"      value={totals.totalViews}  color="purple" />
        <StatCard label="Total Saves"      value={totals.totalSaves}  color="blue" />
        <StatCard label="Inspections"      value={totals.inspections} color="blue" />
        <StatCard label="Rating" value={dealer.rating ? `${dealer.rating.toFixed(1)} / 5` : 'No reviews'} sub={`${dealer.reviewCount || 0} reviews`} color="yellow" />
        <StatCard label="Verified" value={dealer.isVerified ? 'Yes' : 'No'} color={dealer.isVerified ? 'green' : 'yellow'} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <ChartCard title="Listings by Status">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byStatus} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Listings Added per Month">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={listingsPerMonth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Listings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Body Type Breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bodyTypeBreakdown} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 10, fill: '#9ca3af' }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Listings" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {bodyTypeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Top Listings Table */}
      {topListings?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wide">Top Listings by Views</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-400 font-medium">#</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Listing</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Views</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Saves</th>
                </tr>
              </thead>
              <tbody>
                {topListings.map((l, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-300 font-medium">{i + 1}</td>
                    <td className="py-3 font-semibold text-gray-800 max-w-[240px] truncate">{l.title}</td>
                    <td className="py-3 text-right text-blue-600 font-semibold">{l.views?.toLocaleString()}</td>
                    <td className="py-3 text-right text-green-600 font-semibold">{l.saves?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
