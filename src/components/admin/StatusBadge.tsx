const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-amber-100 text-amber-800',
  CONFIRMED:  'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
}
