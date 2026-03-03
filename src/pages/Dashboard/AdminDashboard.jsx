import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import AdminAnalytics from './AdminAnalytics';
import WhatsAppSubmissions from './WhatsAppSubmissions';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MotionDiv = motion.div;

const AdminStatIcons = {
  users: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* main user */}
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
    </svg>
  ),

  listings: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* grid layout */}
      <rect x="3" y="4" width="7" height="7" rx="2" />
      <rect x="14" y="4" width="7" height="7" rx="2" />
      <rect x="3" y="13" width="7" height="7" rx="2" />
      <rect x="14" y="13" width="7" height="7" rx="2" />
    </svg>
  ),

  dealers: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* building */}
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      <path d="M9 21v-4h6v4" />
    </svg>
  ),

  pending: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* clock */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

/** Ultra badge with subtle dot + glow */
const StatusBadge = ({ status }) => {
  const map = {
    active: {
      wrap: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    pending: {
      wrap: 'bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-500/20',
      dot: 'bg-amber-500',
    },
    rejected: {
      wrap: 'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/20',
      dot: 'bg-rose-500',
    },
    draft: {
      wrap: 'bg-slate-50 text-slate-600 ring-slate-200/70 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20',
      dot: 'bg-slate-400',
    },
    archived: {
      wrap: 'bg-slate-50 text-slate-500 ring-slate-200/70 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20',
      dot: 'bg-slate-400',
    },
    sold: {
      wrap: 'bg-sky-50 text-sky-700 ring-sky-200/70 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/20',
      dot: 'bg-sky-500',
    },
  };

  const s = map[status] || map.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${s.wrap}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} shadow-[0_0_0_3px_rgba(255,255,255,0.6)] dark:shadow-none`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

/** Premium button used in tables */
const ActionBtn = ({ tone = 'slate', children, className = '', ...props }) => {
  const tones = {
    emerald:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10 dark:shadow-emerald-950/30',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/10 dark:shadow-rose-950/30',
    amber:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/10 dark:shadow-amber-950/30',
    slate:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 dark:bg-slate-700 dark:hover:bg-slate-600 dark:shadow-slate-950/30',
    ghost:
      'bg-white/80 hover:bg-white text-slate-700 ring-1 ring-slate-200 shadow-slate-900/5 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  };

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold',
        'transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 dark:focus:ring-slate-700 focus:ring-offset-transparent',
        'shadow-sm',
        tones[tone] || tones.slate,
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};

/** Stat card: glass + gradient accent + better hover */
const StatCard = ({ label, value, color = 'blue', icon }) => {
  const tone = {
    blue: 'from-blue-500/10 via-blue-500/5 to-transparent',
    green: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    purple: 'from-violet-500/10 via-violet-500/5 to-transparent',
    yellow: 'from-amber-500/10 via-amber-500/5 to-transparent',
  };

  return (
    <MotionDiv
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative overflow-hidden rounded-3xl p-5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200/70 dark:ring-slate-800/70 shadow-[0_14px_40px_-28px_rgba(2,6,23,0.5)]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tone[color] || tone.blue}`} />
      <div className="relative z-10 flex items-center gap-4">
        {/* ✅ Only show icon container if icon exists */}
        {icon ? (
          <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-slate-950/40 ring-1 ring-slate-200/70 dark:ring-slate-800/70 flex items-center justify-center shadow-sm">
            <span className="text-slate-900 dark:text-white">{icon}</span>
          </div>
        ) : null}

        <div>
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value?.toLocaleString?.() ?? '—'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-0.5 font-semibold tracking-wide">
            {label}
          </p>
        </div>
      </div>
    </MotionDiv>
  );
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [listingStatus, setListingStatus] = useState('pending');
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats().then((r) => r.data.data),
  });

  const { data: listingsData } = useQuery({
    queryKey: ['admin-listings', listingStatus],
    queryFn: () => adminAPI.getListings({ status: listingStatus }).then((r) => r.data),
    enabled: tab === 'listings' || tab === 'overview',
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers().then((r) => r.data),
    enabled: tab === 'users',
  });

  const { data: dealersData } = useQuery({
    queryKey: ['admin-dealers'],
    queryFn: () => adminAPI.getDealers().then((r) => r.data),
    enabled: tab === 'dealers',
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, action, reason }) => adminAPI.moderateListing(id, { action, reason }),
    onSuccess: () => {
      toast.success('Listing updated');
      qc.invalidateQueries(['admin-listings']);
      qc.invalidateQueries(['admin-stats']);
    },
    onError: () => toast.error('Action failed'),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated');
      qc.invalidateQueries(['admin-users']);
    },
  });

  const updateDealerMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateDealer(id, data),
    onSuccess: () => {
      toast.success('Dealer updated');
      qc.invalidateQueries(['admin-dealers']);
    },
  });

  const tabs = ['overview', 'analytics', 'listings', 'users', 'dealers'];

  const thClass =
    'text-left text-[11px] text-slate-600 dark:text-slate-300 uppercase tracking-[0.18em] px-4 py-4 font-extrabold';
  const tdClass =
    'px-4 py-4 text-sm text-slate-700 dark:text-slate-100 border-t border-slate-100/80 dark:border-slate-800/80';

  const CardShell = ({ title, right, children }) => (
    <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl ring-1 ring-slate-200/70 dark:ring-slate-800/70 shadow-[0_14px_40px_-28px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/15 to-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/10 to-sky-500/10 blur-3xl" />
      </div>
      <div className="relative px-6 py-5 border-b border-slate-100/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-300/70 font-semibold">
            Keep everything tidy — fast actions, clean audit trail.
          </p>
        </div>
        {right}
      </div>
      <div className="relative">{children}</div>
    </div>
  );

  const TableWrap = ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full">{children}</table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      {/* Top header */}
      <MotionDiv
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
  className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/70"
>
  {/* Light premium background */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
    <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_60%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.30),transparent_60%)]" />
    <div className="absolute -top-44 -right-28 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_60%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.26),transparent_60%)]" />
    <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgba(2,6,23,0.06)_1px,transparent_1px)] [background-size:22px_22px] dark:opacity-[0.14] dark:[background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/15" />
  </div>

  <div className="relative px-4 sm:px-6 md:px-10 py-7">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-slate-200 px-3 py-1.5 backdrop-blur dark:bg-slate-900/60 dark:ring-slate-800">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_rgba(59,130,246,0.14)]" />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-300">
            Admin control center
          </p>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Platform overview
        </h1>

        <p className="text-slate-600 dark:text-slate-300/80 text-sm max-w-xl">
          Monitor marketplace health, review listings and manage users & dealers in one focused workspace.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/70 ring-1 ring-slate-200 px-3 py-2 backdrop-blur dark:bg-slate-900/60 dark:ring-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            System Online
          </span>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={[
            'group inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold',
            'text-white bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-700',
            'shadow-[0_14px_26px_-18px_rgba(244,63,94,0.55)] ring-1 ring-rose-500/30',
            'transition-all active:scale-[0.98]',
          ].join(' ')}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/85" />
          </span>
          Logout
          <svg
            className="w-4 h-4 opacity-90 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
    </div>

    {/* Tabs (visibility-safe) */}
    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((t) => {
        const active = tab === t;

        return (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'relative isolate px-4 py-2 rounded-full text-sm font-extrabold capitalize whitespace-nowrap',
              'transition-all ring-1 backdrop-blur',
              active
                ? 'text-slate-900 ring-slate-200 bg-white shadow-[0_14px_28px_-20px_rgba(2,6,23,0.22)] dark:text-white dark:bg-slate-900 dark:ring-slate-800'
                : 'text-slate-700 ring-slate-200 bg-white/70 hover:bg-white dark:text-slate-200 dark:bg-slate-900/50 dark:ring-slate-800 dark:hover:bg-slate-900',
            ].join(' ')}
          >
            {/* Active pill that NEVER hides text */}
            {active && (
              <motion.span
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
                style={{ zIndex: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 42 }}
              />
            )}

            {/* Text always on top */}
            <span className="relative z-10">{t}</span>
          </button>
        );
      })}
    </div>
  </div>
</MotionDiv>

      <div className="px-4 sm:px-6 md:px-10 py-10 max-w-[1400px] mx-auto">
        {tab === 'analytics' && <AdminAnalytics />}
       

        {tab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  <StatCard label="Total Users" value={stats?.users} color="blue" />
  <StatCard label="Active Listings" value={stats?.listings} color="green" />
  <StatCard label="Active Dealers" value={stats?.dealers} color="purple" />
  <StatCard label="Pending Review" value={stats?.pendingListings} color="yellow" />
</div>

            <CardShell
              title="Pending Listings"
              right={
                <ActionBtn tone="ghost" onClick={() => setTab('listings')}>
                  View all <span aria-hidden>→</span>
                </ActionBtn>
              }
            >
              <TableWrap>
                <thead>
                  <tr>
                    {['Title', 'Dealer', 'Status', 'Actions'].map((h) => (
                      <th key={h} className={thClass}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentListings?.map((l) => (
                    <tr
                      key={l._id}
                      className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/10 ring-1 ring-slate-200/60 dark:ring-slate-800/60 flex items-center justify-center">
                            <span className="h-2 w-2 rounded-full bg-blue-500/70" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {l.title}
                          </span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <span className="text-slate-600 dark:text-slate-200/80">
                          {l.dealer?.businessName || '—'}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <StatusBadge status={l.status} />
                      </td>
                      <td className={tdClass}>
                        <div className="flex gap-2 flex-wrap">
                          <ActionBtn
                            tone="emerald"
                            onClick={() => moderateMutation.mutate({ id: l._id, action: 'approve' })}
                          >
                            Approve
                          </ActionBtn>
                          <ActionBtn
                            tone="rose"
                            onClick={() =>
                              moderateMutation.mutate({
                                id: l._id,
                                action: 'reject',
                                reason: 'Does not meet requirements',
                              })
                            }
                          >
                            Reject
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            </CardShell>
          </div>
        )}

        {tab === 'listings' && (
          <CardShell
            title="All Listings"
            right={
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {['pending', 'active', 'rejected', 'archived'].map((s) => {
                  const active = listingStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setListingStatus(s)}
                      className={[
                        'text-xs px-3 py-1.5 rounded-full capitalize font-extrabold transition-all',
                        'ring-1',
                        active
                          ? 'bg-slate-900 text-white ring-slate-900 shadow-sm dark:bg-white dark:text-slate-900 dark:ring-white'
                          : 'bg-white/70 text-slate-700 ring-slate-200 hover:bg-white dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            }
          >
            <TableWrap>
              <thead>
                <tr>
                  {['Title', 'Dealer', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listingsData?.data?.map((l) => (
                  <tr
                    key={l._id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className={tdClass + ' max-w-xs'}>
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {l.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-300/70">
                        ID: {l._id?.slice?.(0, 8)}…
                      </p>
                    </td>
                    <td className={tdClass}>
                      <span className="text-slate-600 dark:text-slate-200/80">
                        {l.dealer?.businessName || '—'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {l.price?.toLocaleString?.()} {l.currency}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={l.status} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex gap-2 flex-wrap">
                        {l.status === 'pending' && (
                          <>
                            <ActionBtn
                              tone="emerald"
                              onClick={() => moderateMutation.mutate({ id: l._id, action: 'approve' })}
                            >
                              Approve
                            </ActionBtn>
                            <ActionBtn
                              tone="rose"
                              onClick={() =>
                                moderateMutation.mutate({
                                  id: l._id,
                                  action: 'reject',
                                  reason: 'Does not meet requirements',
                                })
                              }
                            >
                              Reject
                            </ActionBtn>
                          </>
                        )}
                        <ActionBtn
                          tone="amber"
                          onClick={() => moderateMutation.mutate({ id: l._id, action: 'feature' })}
                        >
                          Feature
                        </ActionBtn>
                        <ActionBtn
                          tone="slate"
                          onClick={() => moderateMutation.mutate({ id: l._id, action: 'archive' })}
                        >
                          Archive
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </CardShell>
        )}

        {tab === 'users' && (
          <CardShell title="All Users">
            <TableWrap>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData?.data?.map((u) => (
                  <tr
                    key={u._id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className={tdClass + ' font-semibold text-slate-900 dark:text-white'}>
                      {u.name}
                    </td>
                    <td className={tdClass + ' text-slate-500 dark:text-slate-300/70'}>
                      {u.email}
                    </td>
                    <td className={tdClass}>
                      <span className="inline-flex items-center gap-1.5 capitalize bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200 px-2.5 py-1 rounded-full text-[11px] font-extrabold ring-1 ring-blue-200/60 dark:ring-blue-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {u.role}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ring-1 ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20'
                            : 'bg-rose-50 text-rose-700 ring-rose-200/60 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/20'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <ActionBtn
                        tone={u.isActive ? 'rose' : 'emerald'}
                        onClick={() =>
                          updateUserMutation.mutate({ id: u._id, data: { isActive: !u.isActive } })
                        }
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </ActionBtn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </CardShell>
        )}

        {tab === 'dealers' && (
          <CardShell title="All Dealers">
            <TableWrap>
              <thead>
                <tr>
                  {['Business', 'Email', 'Verified', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dealersData?.data?.map((d) => (
                  <tr
                    key={d._id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className={tdClass + ' font-semibold text-slate-900 dark:text-white'}>
                      {d.businessName}
                    </td>
                    <td className={tdClass + ' text-slate-500 dark:text-slate-300/70'}>
                      {d.email || d.user?.email}
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ring-1 ${
                          d.isVerified
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20'
                            : 'bg-slate-50 text-slate-600 ring-slate-200/60 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${d.isVerified ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {d.isVerified ? 'Verified' : 'No'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ring-1 ${
                          d.isFeatured
                            ? 'bg-amber-50 text-amber-800 ring-amber-200/60 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-500/20'
                            : 'bg-slate-50 text-slate-600 ring-slate-200/60 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${d.isFeatured ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        {d.isFeatured ? 'Featured' : 'No'}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <div className="flex gap-2 flex-wrap">
                        <ActionBtn
                          tone="slate"
                          onClick={() => updateDealerMutation.mutate({ id: d._id, data: { isVerified: !d.isVerified } })}
                        >
                          {d.isVerified ? 'Unverify' : 'Verify'}
                        </ActionBtn>
                        <ActionBtn
                          tone="amber"
                          onClick={() => updateDealerMutation.mutate({ id: d._id, data: { isFeatured: !d.isFeatured } })}
                        >
                          {d.isFeatured ? 'Unfeature' : 'Feature'}
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </CardShell>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;