interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = {
    Pending: 'bg-gray-100 text-gray-700 border-gray-300',
    Sent: 'bg-blue-100 text-blue-700 border-blue-300',
    Viewed: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    Responded: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    Complete: 'bg-green-100 text-green-700 border-green-300',
    Expired: 'bg-red-100 text-red-700 border-red-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${colors[status as keyof typeof colors] || colors.Pending} ${sizes[size]}`}>
      {status}
    </span>
  );
}
