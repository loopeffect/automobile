// Reusable skeleton loading components

const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <Pulse className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Pulse className="h-4 w-3/4" />
      <Pulse className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-3 w-16" />
      </div>
      <Pulse className="h-6 w-1/3" />
    </div>
  </div>
);

export const ListingsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Pulse className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <table className="w-full">
    <tbody>
      {Array.from({ length: rows }).map((_, i) => <TableRowSkeleton key={i} cols={cols} />)}
    </tbody>
  </table>
);

export const DetailSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
    <Pulse className="h-[400px] w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Pulse className="h-8 w-2/3" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Pulse className="h-10 w-full" />
        <Pulse className="h-10 w-full" />
        <Pulse className="h-32 w-full" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
    <Pulse className="h-3 w-1/2" />
    <Pulse className="h-8 w-1/3" />
  </div>
);

export default Pulse;
